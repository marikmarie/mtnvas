import {
	Alert,
	Button,
	createStyles,
	Group,
	MultiSelect,
	Paper,
	Select,
	Stack,
	Text,
	Textarea,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconAlertCircle,
	IconArrowRight,
	IconBuilding,
	IconPackage,
	IconTransfer,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer, Stock, StockTransferRequest } from '../Dealer/types';

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

	formRow: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: theme.spacing.md,

		[theme.fn.smallerThan('sm')]: {
			gridTemplateColumns: '1fr',
		},
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

	infoCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	transferArrow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: theme.colors.gray[5],
		marginTop: theme.spacing.xl,
	},

	imeiInput: {
		'& .mantine-MultiSelect-input': {
			fontFamily: 'monospace',
		},
	},
}));

interface StockTransferModalProps {
	opened: boolean;
	onClose: () => void;
}

export function StockTransferModal({ opened, onClose }: StockTransferModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const { data: dealers } = useQuery({
		queryKey: ['dealer'],
		queryFn: () => request.get('/dealer'),
	});

	const { data: stockItems } = useQuery({
		queryKey: ['stock'],
		queryFn: () =>
			request.get('/stock', {
				params: {
					status: 1,
					pageSize: 1000,
				},
			}),
	});
	const form = useForm<StockTransferRequest>({
		initialValues: {
			imeis: [],
			fromDealerId: '',
			toDealerId: '',
			reason: '',
		},
		validate: {
			imeis: (value) => (value.length === 0 ? 'At least one IMEI is required' : null),
			fromDealerId: (value) => (!value ? 'Source dealer is required' : null),
			toDealerId: (value) => (!value ? 'Destination dealer is required' : null),
			reason: (value) => (!value ? 'Transfer reason is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: StockTransferRequest) => request.post('/stock/transfer', values),
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit((values) => mutation.mutate(values));

	const hasErrors = Object.keys(form.errors).length > 0;

	const dealerOptions = useMemo(() => {
		if (!dealers?.data?.data) return [];
		return dealers.data.data.map((dealer: Dealer) => ({
			value: dealer.id,
			label: dealer.dealerName || 'Unknown Dealer',
		}));
	}, [dealers?.data?.data]);

	const availableImeis =
		stockItems?.data?.data
			?.filter(
				(item: Stock) =>
					item.dealerId === parseInt(form.values.fromDealerId) && item.status === 1
			)
			?.map((item: Stock) => item.imei)
			?.filter(Boolean) || [];

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
						color="blue"
					>
						<IconTransfer size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Transfer Stock
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Transfer stock items between dealers
						</Text>
					</div>
				</div>
			</div>

			<div className={classes.formSection}>
				<Paper
					className={classes.infoCard}
					shadow="xs"
				>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Transfer Information
					</Text>
					<Text size="sm">
						Select the source and destination dealers, choose IMEIs to transfer, and
						provide a reason for the transfer.
					</Text>
				</Paper>

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

				<Stack spacing="lg">
					<div className={classes.formGroup}>
						<Text
							size="sm"
							weight={500}
							color="dimmed"
							mb="xs"
						>
							Source Dealer
						</Text>
						<div className={classes.inputWrapper}>
							<Select
								label="From Dealer"
								placeholder="Select source dealer"
								required
								icon={
									<IconBuilding
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={dealerOptions}
								searchable
								nothingFound="No dealers found"
								{...form.getInputProps('fromDealerId')}
								radius="md"
							/>
						</div>
					</div>

					<div className={classes.transferArrow}>
						<IconArrowRight size={24} />
					</div>

					<div className={classes.formGroup}>
						<Text
							size="sm"
							weight={500}
							color="dimmed"
							mb="xs"
						>
							Destination Dealer
						</Text>
						<div className={classes.inputWrapper}>
							<Select
								label="To Dealer"
								placeholder="Select destination dealer"
								required
								icon={
									<IconBuilding
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={dealerOptions.filter(
									(dealer: Dealer) => dealer.id !== form.values.fromDealerId
								)}
								searchable
								nothingFound="No dealers found"
								{...form.getInputProps('toDealerId')}
								radius="md"
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
							Select IMEIs to Transfer
						</Text>
						<div className={classes.inputWrapper}>
							<MultiSelect
								label="IMEIs"
								placeholder="Select IMEIs to transfer"
								required
								icon={
									<IconPackage
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={availableImeis.map((imei: string) => ({
									value: imei,
									label: imei,
								}))}
								searchable
								nothingFound="No IMEIs available"
								disabled={!form.values.fromDealerId}
								className={classes.imeiInput}
								{...form.getInputProps('imeis')}
								radius="md"
								description={`${availableImeis.length} IMEIs available for transfer`}
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
							Transfer Reason
						</Text>
						<div className={classes.inputWrapper}>
							<Textarea
								label="Reason"
								placeholder="Provide a reason for this transfer"
								required
								minRows={3}
								{...form.getInputProps('reason')}
								radius="md"
								description="Explain why this transfer is necessary"
							/>
						</div>
					</div>
				</Stack>
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
						leftIcon={<IconTransfer size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						Transfer Stock
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
