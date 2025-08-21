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
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { ImeiAvailabilityCheck, ImeiSwapModalProps, ImeiSwapRequest } from '../Dealer/types';

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

export function ImeiSwapModal({ opened, onClose, imei }: ImeiSwapModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const { data: agentsData } = useQuery({
		queryKey: ['agents'],
		queryFn: () => request.get('/agents'),
		enabled: opened,
	});

	const form = useForm<ImeiSwapRequest & { customerId?: string }>({
		initialValues: {
			oldImei: imei || '',
			newImei: '',
			reason: '',
			agentId: 0,
			customerId: '',
		},
		validate: {
			oldImei: (value) => (!value ? 'Old IMEI is required' : null),
			newImei: (value) => (!value ? 'New IMEI is required' : null),
			reason: (value) => (!value ? 'Reason is required' : null),
			agentId: (value) => (!value ? 'Agent is required' : null),
		},
	});

	const { data: availabilityData, isLoading: checkingAvailability } = useQuery({
		queryKey: ['imei-availability', form.values.newImei],
		queryFn: () => request.get(`/imeis/${form.values.newImei}/check`),
		enabled: !!form.values.newImei && form.values.newImei.length >= 15,
	});

	const availability: ImeiAvailabilityCheck | undefined = availabilityData?.data;

	const mutation = useMutation({
		mutationFn: (values: ImeiSwapRequest & { customerId?: string }) => {
			const payload: ImeiSwapRequest = {
				oldImei: values.oldImei,
				newImei: values.newImei,
				reason: values.reason,
				agentId: values.agentId,
				customerId: values.customerId || undefined,
			};
			return request.post('/imeis/swap-request', payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['imeis']);
			queryClient.invalidateQueries(['imei-swap-requests']);
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ImeiSwapRequest & { customerId?: string }) => {
		mutation.mutate(values);
	};

	const hasErrors = Object.keys(form.errors).length > 0;

	return (
		<Modal
			opened={opened}
			close={onClose}
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
						Submit a request to swap IMEI <strong>{imei}</strong> with a new one. This
						request will need approval.
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
									{...form.getInputProps('oldImei')}
									value={imei}
								/>
							</div>

							<div className={classes.swapArrow}>
								<IconArrowRight size={24} />
							</div>

							<div className={classes.inputWrapper}>
								<TextInput
									label="New IMEI"
									placeholder="Enter new IMEI number"
									required
									icon={
										<IconDeviceMobile
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('newImei')}
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
													color={availability.available ? 'green' : 'red'}
													size="sm"
												>
													{availability.available ? 'Yes' : 'No'}
												</Badge>
											</Group>
											<Group spacing="xs">
												<Text size="sm">Can Swap:</Text>
												<Badge
													color={availability.canSwap ? 'green' : 'red'}
													size="sm"
												>
													{availability.canSwap ? 'Yes' : 'No'}
												</Badge>
											</Group>
											<Group spacing="xs">
												<Text size="sm">Status:</Text>
												<Badge
													color="blue"
													size="sm"
												>
													{availability.currentStatus}
												</Badge>
											</Group>
											{!availability.canSwap && (
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
								Agent Information
							</Text>
							<div className={classes.inputWrapper}>
								<Select
									label="Requesting Agent"
									placeholder="Select the agent requesting this swap"
									required
									icon={
										<IconUser
											size={16}
											className={classes.inputIcon}
										/>
									}
									data={
										agentsData?.data?.data?.map((agent: any) => ({
											value: agent.id,
											label: `${agent.name} (${agent.userType})`,
										})) || []
									}
									searchable
									nothingFound="No agents found"
									{...form.getInputProps('agentId')}
									radius="md"
									description="The agent who is requesting this IMEI swap"
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
								Customer Information (Optional)
							</Text>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Customer ID"
									placeholder="Enter customer ID if applicable"
									icon={
										<IconUserCircle
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('customerId')}
									radius="md"
									description="Optional: Customer ID associated with this device"
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
						onClick={onClose}
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
						disabled={availability && !availability.canSwap}
					>
						Submit Swap Request
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
