import {
	Button,
	Group,
	Stack,
	Text,
	createStyles,
	ThemeIcon,
	Alert,
	Paper,
	Textarea,
	Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	IconCheck,
	IconX,
	IconDeviceMobile,
	IconUser,
	IconCalendar,
	IconAlertCircle,
	IconArrowRight,
	IconMessageCircle,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { ImeiSwapApprovalModalProps, ImeiSwapApproval } from '../Dealer/types';

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

	requestCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	detailRow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: `${theme.spacing.sm} 0`,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,

		'&:last-child': {
			borderBottom: 'none',
		},
	},

	detailLabel: {
		fontWeight: 500,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
	},

	detailValue: {
		fontWeight: 600,
	},

	imeiCode: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
	},

	swapVisualization: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing.lg,
		padding: theme.spacing.lg,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		marginBottom: theme.spacing.lg,
	},

	imeiBox: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		textAlign: 'center',
		flex: 1,
	},

	arrowContainer: {
		color: theme.colors.blue[6],
	},

	statusBadge: {
		fontWeight: 600,
	},

	actionButtons: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: theme.spacing.md,
	},
}));

export function ImeiSwapApprovalModal({
	opened,
	onClose,
	swapRequest,
}: ImeiSwapApprovalModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ImeiSwapApproval>({
		initialValues: {
			action: 'approve',
			reason: '',
		},
		validate: {
			reason: (value, values) => {
				if (values.action === 'reject' && !value) {
					return 'Reason is required when rejecting a swap request';
				}
				return null;
			},
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ImeiSwapApproval) =>
			request.post(`/imeis/swap-requests/${swapRequest.id}/approval`, values),
		onSuccess: () => {
			queryClient.invalidateQueries(['imei-swap-requests']);
			queryClient.invalidateQueries(['imeis']);
			onClose();
			form.reset();
		},
	});

	const handleApprove = () => {
		form.setFieldValue('action', 'approve');
		mutation.mutate({ action: 'approve', reason: form.values.reason || undefined });
	};

	const handleReject = () => {
		form.setFieldValue('action', 'reject');
		if (!form.values.reason) {
			form.setFieldError('reason', 'Reason is required when rejecting a swap request');
			return;
		}
		mutation.mutate({ action: 'reject', reason: form.values.reason });
	};

	const hasErrors = Object.keys(form.errors).length > 0;

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
						color="orange"
					>
						<IconDeviceMobile size={20} />
					</ThemeIcon>
					<div>
						<Text
							size="lg"
							weight={600}
						>
							IMEI Swap Request Approval
						</Text>
						<Text
							color="dimmed"
							size="sm"
						>
							Review and approve or reject the IMEI swap request
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* Request Information */}
				<Paper
					className={classes.requestCard}
					shadow="xs"
				>
					<Group
						position="apart"
						mb="md"
					>
						<Text
							size="md"
							weight={600}
						>
							Request Details
						</Text>
						<Badge
							color="orange"
							variant="light"
							size="sm"
							className={classes.statusBadge}
						>
							{swapRequest.status.toUpperCase()}
						</Badge>
					</Group>

					<Stack spacing="sm">
						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Request ID:</Text>
							<Text className={classes.detailValue}>{swapRequest.id}</Text>
						</div>
						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Agent:</Text>
							<Group spacing="xs">
								<IconUser
									size={16}
									color="gray"
								/>
								<Text className={classes.detailValue}>{swapRequest.agentName}</Text>
							</Group>
						</div>
						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Requested:</Text>
							<Group spacing="xs">
								<IconCalendar
									size={16}
									color="gray"
								/>
								<Text className={classes.detailValue}>
									{new Date(swapRequest.requestedAt).toLocaleString()}
								</Text>
							</Group>
						</div>
						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Reason:</Text>
							<Text className={classes.detailValue}>{swapRequest.reason}</Text>
						</div>
					</Stack>
				</Paper>

				{/* IMEI Swap Visualization */}
				<Paper
					className={classes.swapVisualization}
					shadow="xs"
				>
					<div className={classes.imeiBox}>
						<Text
							size="sm"
							color="dimmed"
							mb="xs"
						>
							Current IMEI
						</Text>
						<Text className={classes.imeiCode}>{swapRequest.oldImei}</Text>
					</div>

					<div className={classes.arrowContainer}>
						<IconArrowRight size={32} />
					</div>

					<div className={classes.imeiBox}>
						<Text
							size="sm"
							color="dimmed"
							mb="xs"
						>
							New IMEI
						</Text>
						<Text className={classes.imeiCode}>{swapRequest.newImei}</Text>
					</div>
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

				{/* Approval Comments */}
				<div className={classes.formGroup}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Comments (Required for rejection)
					</Text>
					<div className={classes.inputWrapper}>
						<Textarea
							label="Approval/Rejection Comments"
							placeholder="Enter comments about this decision (required for rejection)"
							minRows={3}
							icon={
								<IconMessageCircle
									size={16}
									className={classes.inputIcon}
								/>
							}
							{...form.getInputProps('reason')}
							radius="md"
						/>
					</div>
				</div>
			</div>

			{/* Enhanced Actions */}
			<div className={classes.actions}>
				<Group
					position="apart"
					spacing="md"
				>
					<Button
						variant="subtle"
						onClick={onClose}
						radius="md"
					>
						Cancel
					</Button>

					<div className={classes.actionButtons}>
						<Button
							color="red"
							leftIcon={<IconX size={16} />}
							className={classes.submitButton}
							radius="md"
							loading={mutation.isLoading && form.values.action === 'reject'}
							onClick={handleReject}
						>
							Reject
						</Button>
						<Button
							color="green"
							leftIcon={<IconCheck size={16} />}
							className={classes.submitButton}
							radius="md"
							loading={mutation.isLoading && form.values.action === 'approve'}
							onClick={handleApprove}
						>
							Approve
						</Button>
					</div>
				</Group>
			</div>
		</Modal>
	);
}
