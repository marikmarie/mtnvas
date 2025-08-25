import {
	Alert,
	Badge,
	Button,
	createStyles,
	Group,
	Paper,
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
	IconCheck,
	IconClock,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer, StockTransfer } from '../Dealer/types';

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

	content: {
		padding: theme.spacing.lg,
	},

	actions: {
		padding: theme.spacing.lg,
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	transferCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	transferRoute: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: theme.spacing.md,
	},

	dealerInfo: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		padding: theme.spacing.sm,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		borderRadius: theme.radius.sm,
		flex: 1,
	},

	transferArrow: {
		margin: `0 ${theme.spacing.md}`,
		color: theme.colors.gray[5],
	},

	detailRow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: `${theme.spacing.xs} 0`,
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

	statusBadge: {
		fontWeight: 600,
	},

	imeiList: {
		maxHeight: 200,
		overflowY: 'auto',
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		borderRadius: theme.radius.sm,
		padding: theme.spacing.sm,
	},

	imeiItem: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
		borderRadius: theme.radius.sm,
		marginBottom: theme.spacing.xs,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,

		'&:last-child': {
			marginBottom: 0,
		},
	},

	actionAlert: {
		marginBottom: theme.spacing.md,
	},

	submitButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'translateY(-1px)',
			boxShadow: theme.shadows.md,
		},
	},
}));

interface StockTransferApprovalModalProps {
	opened: boolean;
	onClose: () => void;
	transfer: StockTransfer | null;
	action: 'Approve' | 'Reject';
}

export function StockTransferApprovalModal({
	opened,
	onClose,
	transfer,
	action,
}: StockTransferApprovalModalProps) {
	const { classes } = useStyles();
	const queryClient = useQueryClient();
	const request = useRequest(true);

	const { data: dealersData } = useQuery({
		queryKey: ['dealer'],
		queryFn: () => request.get('/dealer'),
	});
	const form = useForm<{ reason: string }>({
		initialValues: {
			reason: action === 'Approve' ? '' : 'Transfer not necessary',
		},
		validate: {
			reason: (value) =>
				action === 'Reject' && !value ? 'Reason is required for rejection' : null,
		},
	});

	const mutation = useMutation({
		mutationFn: (values: { reason: string }) => {
			if (!transfer) throw new Error('No transfer selected');
			return request.post(
				`/stock/transfer/${transfer.id}/approval?action=${action}&reason=${values.reason}`
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['stock-transfers']);
			queryClient.invalidateQueries(['stock-transfers/summary']);
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit((values) => {
		mutation.mutate(values);
	});

	const handleClose = () => {
		onClose();
		form.reset();
	};

	if (!transfer) return null;

	const isApprove = action === 'Approve';
	const actionColor = isApprove ? 'green' : 'red';
	const actionIcon = isApprove ? <IconCheck size={20} /> : <IconX size={20} />;
	const actionText = isApprove ? 'Approve' : 'Reject';

	return (
		<Modal
			opened={opened}
			close={handleClose}
			size="lg"
		>
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color={actionColor}
					>
						{actionIcon}
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							{actionText} Transfer
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							{isApprove
								? 'Approve this stock transfer request'
								: 'Reject this stock transfer request'}
						</Text>
					</div>
				</div>
			</div>

			<div className={classes.content}>
				<Paper
					className={classes.transferCard}
					shadow="xs"
				>
					<div className={classes.transferRoute}>
						<div className={classes.dealerInfo}>
							<IconBuilding
								size={16}
								color="gray"
							/>
							<div>
								<Text
									size="sm"
									weight={500}
								>
									{
										dealersData?.data.data.find(
											(d: Dealer) => d.id === transfer.fromDealerId
										)?.dealerName
									}
								</Text>
								<Text
									size="xs"
									color="dimmed"
								>
									Source Dealer
								</Text>
							</div>
						</div>

						<div className={classes.transferArrow}>
							<IconArrowRight size={24} />
						</div>

						<div className={classes.dealerInfo}>
							<IconBuilding
								size={16}
								color="gray"
							/>
							<div>
								<Text
									size="sm"
									weight={500}
								>
									{
										dealersData?.data.data.find(
											(d: Dealer) => d.id === transfer.toDealerId
										)?.dealerName
									}
								</Text>
								<Text
									size="xs"
									color="dimmed"
								>
									Destination Dealer
								</Text>
							</div>
						</div>
					</div>

					<Stack spacing="sm">
						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Transfer ID:</Text>
							<Text
								className={classes.detailValue}
								style={{ fontFamily: 'monospace' }}
							>
								{transfer.id.toString().slice(-8).toUpperCase()}
							</Text>
						</div>

						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Items Count:</Text>
							<Badge
								color="blue"
								variant="light"
								size="lg"
							>
								{transfer.imeiCount} items
							</Badge>
						</div>

						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Requested By:</Text>
							<Group spacing="xs">
								<IconUser
									size={16}
									color="gray"
								/>
								<Text className={classes.detailValue}>
									{transfer.transferredBy || 'Unknown'}
								</Text>
							</Group>
						</div>

						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Request Date:</Text>
							<Group spacing="xs">
								<IconClock
									size={16}
									color="gray"
								/>
								<Text className={classes.detailValue}>
									{new Date(transfer.createdAt).toLocaleString()}
								</Text>
							</Group>
						</div>

						<div className={classes.detailRow}>
							<Text className={classes.detailLabel}>Current Status:</Text>
							<Badge
								color="yellow"
								variant="light"
								size="sm"
								leftSection={<IconClock size={14} />}
								className={classes.statusBadge}
							>
								{transfer.status || 'Pending'}
							</Badge>
						</div>

						{transfer.reason && (
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Transfer Reason:</Text>
								<Text className={classes.detailValue}>{transfer.reason}</Text>
							</div>
						)}
					</Stack>
				</Paper>

				<Alert
					icon={<IconAlertCircle size={16} />}
					title={`${actionText} Transfer`}
					color={actionColor}
					className={classes.actionAlert}
				>
					{isApprove
						? 'This will approve the transfer and move the selected items to the destination dealer.'
						: 'This will reject the transfer request. The items will remain with the source dealer.'}
				</Alert>

				<form onSubmit={handleSubmit}>
					<Stack spacing="md">
						<Textarea
							label={isApprove ? 'Approval Notes (Optional)' : 'Rejection Reason'}
							placeholder={
								isApprove
									? 'Add any notes about this approval...'
									: 'Explain why this transfer is being rejected...'
							}
							required={!isApprove}
							minRows={3}
							{...form.getInputProps('reason')}
							radius="md"
							description={
								isApprove
									? 'Optional notes for the approval'
									: 'This reason will be shared with the requester'
							}
						/>
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
						onClick={handleClose}
						radius="md"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={mutation.isLoading}
						leftIcon={actionIcon}
						color={actionColor}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						{actionText} Transfer
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
