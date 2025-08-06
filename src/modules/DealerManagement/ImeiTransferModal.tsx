import {
	Button,
	Group,
	Select,
	Stack,
	TextInput,
	Title,
	Text,
	createStyles,
	ThemeIcon,
	Alert,
	Paper,
	Badge
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	IconTransfer,
	IconDeviceMobile,
	IconBuilding,
	IconBox,
	IconAlertCircle,
	IconArrowRight
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface ImeiTransferModalProps {
	opened: boolean;
	onClose: () => void;
	imei: string;
	fromDealer: Dealer;
	dealers: Dealer[];
}

interface ImeiTransferFormValues {
	toDealerId: string;
	toProductId: string;
}

const useStyles = createStyles((theme) => ({
	modalContent: {
		padding: 0,
	},

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

	transferInfo: {
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
		margin: theme.spacing.md 0,
		color: theme.colors.blue[6],
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

	dealerInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		padding: theme.spacing.xs,
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
	},
}));

export function ImeiTransferModal({
	opened,
	onClose,
	imei,
	fromDealer,
	dealers,
}: ImeiTransferModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ImeiTransferFormValues>({
		initialValues: {
			toDealerId: '',
			toProductId: '',
		},
		validate: {
			toDealerId: (value) => (!value ? 'Target dealer is required' : null),
			toProductId: (value) => (!value ? 'Target product is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ImeiTransferFormValues) => {
			return request.post('/imei-transfers', {
				imei,
				fromDealerId: fromDealer?.id,
				...values,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['imeis'] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ImeiTransferFormValues) => {
		mutation.mutate(values);
	};

	const dealerOptions = dealers
		.filter((dealer) => dealer?.id !== fromDealer?.id)
		.map((dealer) => ({
			value: dealer?.id,
			label: dealer?.name,
		}));

	const hasErrors = Object.keys(form.errors).length > 0;
	const selectedToDealer = dealers.find((d) => d.id === form.values.toDealerId);

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
			classNames={{
				content: classes.modalContent,
			}}
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
						<Title order={3} size="h4">
							Transfer IMEI
						</Title>
						<Text color="dimmed" size="sm">
							Move IMEI from one dealer to another
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* Transfer Information */}
				<div className={classes.transferInfo}>
					<Text size="sm" weight={500} color="dimmed" mb="xs">
						Transfer Details
					</Text>
					<Text size="sm">
						You are about to transfer IMEI <strong>{imei}</strong> to a different dealer.
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
						{/* IMEI Display */}
						<div className={classes.formGroup}>
							<Text size="sm" weight={500} color="dimmed" mb="xs">
								IMEI to Transfer
							</Text>
							<div className={classes.inputWrapper}>
								<TextInput
									label="IMEI Number"
									value={imei}
									disabled
									icon={<IconDeviceMobile size={16} className={classes.inputIcon} />}
									className={classes.imeiDisplay}
									radius="md"
								/>
							</div>
						</div>

						{/* Transfer Details */}
						<div className={classes.formGroup}>
							<Text size="sm" weight={500} color="dimmed" mb="xs">
								Transfer Details
							</Text>

							{/* From Dealer */}
							<div className={classes.inputWrapper}>
								<TextInput
									label="From Dealer"
									value={fromDealer?.name}
									disabled
									icon={<IconBuilding size={16} className={classes.inputIcon} />}
									className={classes.dealerInfo}
									radius="md"
								/>
							</div>

							{/* Transfer Arrow */}
							<div className={classes.transferArrow}>
								<IconArrowRight size={24} />
							</div>

							{/* To Dealer and Product */}
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<Select
										label="To Dealer"
										placeholder="Select target dealer"
										required
										icon={<IconBuilding size={16} className={classes.inputIcon} />}
										data={dealerOptions}
										{...form.getInputProps('toDealerId')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<Select
										label="To Product"
										placeholder="Select target product"
										required
										icon={<IconBox size={16} className={classes.inputIcon} />}
										data={[
											{ value: 'product1', label: 'Product 1' },
											{ value: 'product2', label: 'Product 2' },
											{ value: 'product3', label: 'Product 3' },
										]}
										{...form.getInputProps('toProductId')}
										radius="md"
									/>
								</div>
							</div>

							{/* Selected Dealer Info */}
							{selectedToDealer && (
								<Paper className={classes.dealerInfo} shadow="xs">
									<Text size="sm" weight={500} color="dimmed" mb="xs">
										Target Dealer Information
									</Text>
									<Text size="sm">
										<strong>{selectedToDealer.name}</strong> • {selectedToDealer.category}
									</Text>
								</Paper>
							)}
						</div>
					</Stack>
				</form>
			</div>

			{/* Enhanced Actions */}
			<div className={classes.actions}>
				<Group position="right" spacing="md">
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
						onClick={form.onSubmit(handleSubmit)}
					>
						Transfer IMEI
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
