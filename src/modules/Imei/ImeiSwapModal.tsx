import {
	Alert,
	Badge,
	Button,
	Group,
	Paper,
	Select,
	Stack,
	Text,
	TextInput,
	Textarea,
	ThemeIcon,
	Title,
	createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconAlertCircle,
	IconArrowRight,
	IconDeviceMobile,
	IconFileText,
	IconRefresh,
	IconUser,
	IconUserCircle,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import {
	Dealer,
	ImeiAvailabilityCheck,
	ImeiSwapModalProps,
	ImeiSwapRequestPayload,
	Stock,
} from '../Dealer/types';

const useStyles = createStyles((theme) => ({
	header: {
		padding: theme.spacing.lg,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	headerContent: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
	},

	formSection: {
		padding: theme.spacing.lg,
	},

	formGroup: {
		marginBottom: theme.spacing.md,
	},

	inputWrapper: {
		position: 'relative',
	},

	inputIcon: {
		color: theme.colors.gray[5],
	},

	actions: {
		padding: theme.spacing.lg,
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	submitButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'translateY(-1px)',
			boxShadow: theme.shadows.md,
		},
	},

	errorAlert: {
		marginBottom: theme.spacing.md,
	},

	imeiInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	swapArrow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: theme.spacing.md,
		color: theme.colors.yellow[6],
	},

	imeiDisplay: {
		fontFamily: 'monospace',
		fontSize: theme.fontSizes.sm,
		fontWeight: 600,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
		padding: theme.spacing.xs,
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
	},

	availabilityCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.md,
	},
}));

export function ImeiSwapModal({ opened, close, selectedImei }: ImeiSwapModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();
	const user = useSelector((state: RootState) => state.auth.user);

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/dealer'),
		enabled: opened,
	});

	const dealerOptions = useMemo(() => {
		if (!dealersData?.data?.data) return [];
		return dealersData.data.data.map((dealer: Dealer) => ({
			value: dealer.id,
			label: dealer.dealerName.toUpperCase() || 'Unknown Dealer',
		}));
	}, [dealersData?.data?.data]);

	const form = useForm<ImeiSwapRequestPayload>({
		initialValues: {
			newImei: '',
			reason: '',
			dealerId: 0,
			requestedBy: user?.name || user?.email || '',
		},
		validate: {
			newImei: (value) => (!value ? 'New IMEI is required' : null),
			reason: (value) => (!value ? 'Reason is required' : null),
			dealerId: (value) => (!value ? 'Dealer is required' : null),
			requestedBy: (value) => (!value ? 'Requested by is required' : null),
		},
	});

	const { data: availabilityData, isLoading: checkingAvailability } = useQuery({
		queryKey: ['imei-availability', form.values.newImei],
		queryFn: () => request.get(`/imeis/${form.values.newImei}/check`),
		enabled: !!form.values.newImei && form.values.newImei.length >= 15,
	});

	const availability: ImeiAvailabilityCheck | undefined =
		availabilityData?.data as unknown as ImeiAvailabilityCheck;

	const mutation = useMutation({
		mutationFn: (values: ImeiSwapRequestPayload) => {
			return request.post('/imeis/swap-request', {
				...values,
				oldImei: selectedImei || '',
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['imeis']);
			queryClient.invalidateQueries(['imei-swap-requests']);
			close();
			form.reset();
		},
	});

	const handleSubmit = (values: ImeiSwapRequestPayload) => {
		mutation.mutate(values);
	};

	const { data: stockData } = useQuery({
		queryKey: ['stock'],
		queryFn: () => request.get('/stock'),
	});

	const imeiList: Stock[] = stockData?.data?.data || stockData?.data || [];
	const availableImei: Stock | undefined = imeiList.find((imei) => imei.imei === selectedImei);
	const availableImeiListToSwap: Stock[] = imeiList.filter((imei) => imei.imei !== selectedImei);

	const hasErrors = Object.keys(form.errors).length > 0;

	return (
		<Modal
			opened={opened}
			close={close}
			size="lg"
		>
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color="orange"
					>
						<IconRefresh size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Swap IMEI
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Replace an existing IMEI with a new one
						</Text>
					</div>
				</div>
			</div>

			<div className={classes.formSection}>
				<div className={classes.imeiInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						IMEI Swap Request
					</Text>
					<Text size="sm">
						Submit a request to swap IMEI <strong>{availableImei?.imei}</strong> with a
						new one. This request will need approval.
					</Text>
				</div>

				{hasErrors && (
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Please fix the following errors"
						color="red"
						className={classes.errorAlert}
					>
						Please correct the highlighted fields before submitting.
					</Alert>
				)}

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack spacing="lg">
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								IMEI Swap
							</Text>

							<div className={classes.inputWrapper}>
								<TextInput
									label="Current IMEI"
									disabled
									icon={
										<IconDeviceMobile
											size={16}
											className={classes.inputIcon}
										/>
									}
									className={classes.imeiDisplay}
									radius="md"
									value={availableImei?.imei || ''}
								/>
							</div>

							<div className={classes.swapArrow}>
								<IconArrowRight size={24} />
							</div>

							<div className={classes.inputWrapper}>
								<Select
									label="New IMEI"
									placeholder="Select new IMEI number"
									required
									icon={
										<IconDeviceMobile
											size={16}
											className={classes.inputIcon}
										/>
									}
									data={availableImeiListToSwap.map((imei) => ({
										value: imei.imei,
										label: imei.imei,
									}))}
									{...form.getInputProps('newImei')}
									searchable
									clearable
									radius="md"
									description="Enter the 15-digit IMEI number for the replacement device"
								/>
							</div>

							{form.values.newImei && form.values.newImei.length >= 15 && (
								<Paper
									className={classes.availabilityCard}
									shadow="xs"
								>
									<Text
										size="sm"
										weight={500}
										mb="xs"
									>
										IMEI Availability Check
									</Text>
									{checkingAvailability ? (
										<Text
											size="sm"
											color="dimmed"
										>
											Checking availability...
										</Text>
									) : availability ? (
										<Stack spacing="xs">
											<Group spacing="xs">
												<Text size="sm">Available:</Text>
												<Badge
													color={
														availability.statusCode === 200
															? 'green'
															: 'red'
													}
													size="sm"
												>
													{availability.statusCode === 200 ? 'Yes' : 'No'}
												</Badge>
											</Group>
											<Group spacing="xs">
												<Text size="sm">Can Swap:</Text>
												<Badge
													color={
														availability.statusCode === 200
															? 'green'
															: 'red'
													}
													size="sm"
												>
													{availability.statusCode === 200 ? 'Yes' : 'No'}
												</Badge>
											</Group>
											<Group spacing="xs">
												<Text size="sm">Status:</Text>
												<Badge
													color="blue"
													size="sm"
												>
													{availability.message}
												</Badge>
											</Group>
											{availability.statusCode !== 200 && (
												<Alert
													icon={<IconAlertCircle size={16} />}
													color="red"
												>
													This IMEI cannot be used for swapping
												</Alert>
											)}
										</Stack>
									) : (
										<Text
											size="sm"
											color="dimmed"
										>
											Invalid IMEI format
										</Text>
									)}
								</Paper>
							)}
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Dealer Information
							</Text>
							<div className={classes.inputWrapper}>
								<Select
									label="Dealer"
									placeholder="Select the dealer for this swap"
									required
									icon={
										<IconUser
											size={16}
											className={classes.inputIcon}
										/>
									}
									data={dealerOptions}
									searchable
									{...form.getInputProps('dealerId')}
									description="The dealer associated with this IMEI swap"
								/>
							</div>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Request Information
							</Text>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Requested By"
									placeholder="Enter your name or ID"
									required
									icon={
										<IconUserCircle
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('requestedBy')}
									radius="md"
									description="Your name or ID for tracking this request"
									{...form.getInputProps('requestedBy')}
								/>
							</div>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Swap Reason
							</Text>
							<div className={classes.inputWrapper}>
								<Textarea
									label="Reason for Swap"
									placeholder="Enter detailed reason for swapping IMEI (e.g., device malfunction, upgrade, etc.)"
									required
									minRows={3}
									icon={
										<IconFileText
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('reason')}
									radius="md"
									description="Provide a detailed explanation for why this IMEI swap is necessary"
								/>
							</div>
						</div>
					</Stack>
				</form>
			</div>

			<div className={classes.actions}>
				<Group
					position="right"
					spacing="md"
				>
					<Button
						variant="subtle"
						onClick={close}
						radius="md"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={mutation.isLoading}
						leftIcon={<IconRefresh size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit(form.values)}
						disabled={availability && availability.statusCode !== 200}
					>
						Submit Swap Request
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
