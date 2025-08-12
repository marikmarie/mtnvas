import {
	Button,
	Group,
	Stack,
	Title,
	Text,
	createStyles,
	ThemeIcon,
	Alert,
	Paper,
	Textarea,
	MultiSelect,
	Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	IconTransfer,
	IconBuilding,
	IconAlertCircle,
	IconArrowRight,
	IconPackage,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { StockTransferRequest } from '../Dealer/types';

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
		queryKey: ['dealers/list'],
		queryFn: () => request.get('/lookups/dealers'),
	});

	const { data: stockItems } = useQuery({
		queryKey: ['stocks/available'],
		queryFn: () => request.get('/stocks', { params: { status: 'available' } }),
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
		mutationFn: (values: StockTransferRequest) => request.post('/stocks/transfer', values),
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit((values) => mutation.mutate(values));

	const hasErrors = Object.keys(form.errors).length > 0;

	// Get available IMEIs for the selected source dealer
	const availableImeis =
		stockItems?.data?.data
			?.filter(
				(item: any) =>
					item.dealerId === form.values.fromDealerId && item.status === 'available'
			)
			?.map((item: any) => item.imei || item.serialNumber)
			?.filter(Boolean) || [];

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
		>
			{/* Enhanced Header */}
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

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* Information Card */}
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

				<form onSubmit={handleSubmit}>
					<Stack spacing="lg">
						{/* Source Dealer */}
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
									data={dealers?.data?.data || []}
									searchable
									nothingFound="No dealers found"
									{...form.getInputProps('fromDealerId')}
									radius="md"
								/>
							</div>
						</div>

						{/* Transfer Arrow */}
						<div className={classes.transferArrow}>
							<IconArrowRight size={24} />
						</div>

						{/* Destination Dealer */}
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
									data={
										dealers?.data?.data?.filter(
											(dealer: any) => dealer.id !== form.values.fromDealerId
										) || []
									}
									searchable
									nothingFound="No dealers found"
									{...form.getInputProps('toDealerId')}
									radius="md"
								/>
							</div>
						</div>

						{/* IMEI Selection */}
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

						{/* Transfer Reason */}
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
				</form>
			</div>

			{/* Enhanced Actions */}
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
