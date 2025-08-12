import {
	Button,
	Divider,
	Group,
	Modal,
	Paper,
	Stack,
	Table,
	Text,
	Textarea,
	ThemeIcon,
	createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconCash, IconCheck, IconMessageCircle } from '@tabler/icons-react';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { BulkCommissionPaymentModalProps, CommissionEarning } from '../Dealer/types';

const useStyles = createStyles((theme) => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
		marginBottom: theme.spacing.xl,
	},

	formSection: {
		padding: `0 ${theme.spacing.xs}`,
	},

	actions: {
		padding: theme.spacing.md,
		paddingBottom: theme.spacing.lg,
		borderTop: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	summaryCard: {
		padding: theme.spacing.md,
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.green[9] : theme.colors.green[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[2]
		}`,
		marginBottom: theme.spacing.lg,
	},

	earningsTable: {
		'& th': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
			fontWeight: 600,
		},
		'& td': {
			borderBottom: `1px solid ${
				theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
			}`,
		},
	},

	totalRow: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.green[9] : theme.colors.green[0],
		fontWeight: 600,
	},

	inputIcon: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},
}));

interface BulkPaymentForm {
	notes: string;
}

export function BulkCommissionPaymentModal({
	opened,
	onClose,
	selectedEarnings,
}: BulkCommissionPaymentModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<BulkPaymentForm>({
		initialValues: {
			notes: '',
		},
		validate: {
			notes: (value) => {
				if (!value || value.trim().length === 0) {
					return 'Payment notes are required';
				}
				if (value.trim().length < 10) {
					return 'Please provide more detailed payment notes (minimum 10 characters)';
				}
				return null;
			},
		},
	});

	// Filter only pending earnings
	const pendingEarnings = selectedEarnings.filter((earning) => earning.status === 'pending');
	const totalAmount = pendingEarnings.reduce((sum, earning) => sum + earning.commissionAmount, 0);

	// Bulk payment mutation
	const bulkPaymentMutation = useMutation({
		mutationFn: async (data: { earningIds: string[]; notes: string }) => {
			const response = await request.post('/commissions/bulk-payment', {
				earningIds: data.earningIds,
				notes: data.notes,
			});
			return response.data;
		},
		onSuccess: () => {
			// Invalidate relevant queries
			queryClient.invalidateQueries(['commission-earnings']);

			// Reset form and close modal
			form.reset();
			onClose();
		},
		onError: (error) => {
			console.error('Bulk payment failed:', error);
		},
	});

	const handleSubmit = (values: BulkPaymentForm) => {
		const earningIds = pendingEarnings.map((earning) => earning.id);
		bulkPaymentMutation.mutate({
			earningIds,
			notes: values.notes.trim(),
		});
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	// Group earnings by agent for better display
	const earningsByAgent = pendingEarnings.reduce(
		(acc, earning) => {
			const agentName = earning.agentName;
			if (!acc[agentName]) {
				acc[agentName] = [];
			}
			acc[agentName].push(earning);
			return acc;
		},
		{} as Record<string, CommissionEarning[]>
	);

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={null}
			size="lg"
			radius="lg"
			padding={0}
			styles={{
				body: { padding: 0 },
				header: { display: 'none' },
			}}
		>
			{/* Custom Header */}
			<div
				className={classes.header}
				style={{ padding: '24px 24px 0' }}
			>
				<ThemeIcon
					size="lg"
					radius="md"
					color="green"
				>
					<IconCash size={24} />
				</ThemeIcon>
				<div>
					<Text
						size="lg"
						weight={600}
					>
						Bulk Commission Payment
					</Text>
					<Text
						color="dimmed"
						size="sm"
					>
						Process payment for {pendingEarnings.length} commission earnings
					</Text>
				</div>
			</div>

			<form onSubmit={form.onSubmit(handleSubmit)}>
				<div className={classes.formSection}>
					{/* Payment Summary */}
					<div className={classes.summaryCard}>
						<Group
							position="apart"
							mb="md"
						>
							<Text
								size="md"
								weight={600}
							>
								Payment Summary
							</Text>
							<Group spacing="xs">
								<IconCheck size={16} />
								<Text
									size="sm"
									color="green"
									weight={500}
								>
									Ready for Payment
								</Text>
							</Group>
						</Group>

						<Group position="apart">
							<div>
								<Text
									size="sm"
									color="dimmed"
								>
									Total Earnings
								</Text>
								<Text
									size="lg"
									weight={700}
									color="green"
								>
									{formatCurrency(totalAmount)}
								</Text>
							</div>
							<div style={{ textAlign: 'right' }}>
								<Text
									size="sm"
									color="dimmed"
								>
									Transactions
								</Text>
								<Text
									size="lg"
									weight={700}
								>
									{pendingEarnings.length}
								</Text>
							</div>
						</Group>
					</div>

					{/* Earnings Breakdown */}
					<Paper
						withBorder
						radius="md"
						p="md"
						mb="lg"
					>
						<Text
							size="md"
							weight={600}
							mb="md"
						>
							Earnings Breakdown
						</Text>

						<Table
							className={classes.earningsTable}
							highlightOnHover
						>
							<thead>
								<tr>
									<th>Agent</th>
									<th>Product</th>
									<th>Transaction ID</th>
									<th>Amount</th>
									<th>Earned Date</th>
								</tr>
							</thead>
							<tbody>
								{pendingEarnings.map((earning) => (
									<tr key={earning.id}>
										<td>{earning.agentName}</td>
										<td>{earning.productName}</td>
										<td>
											<Text
												size="sm"
												weight={500}
											>
												{earning.transactionId}
											</Text>
										</td>
										<td>
											<Text
												weight={600}
												color="green"
											>
												{formatCurrency(earning.commissionAmount)}
											</Text>
										</td>
										<td>
											<Text size="sm">
												{new Date(earning.earnedAt).toLocaleDateString()}
											</Text>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className={classes.totalRow}>
									<td colSpan={3}>
										<Text weight={700}>Total Payment</Text>
									</td>
									<td>
										<Text
											weight={700}
											color="green"
										>
											{formatCurrency(totalAmount)}
										</Text>
									</td>
									<td></td>
								</tr>
							</tfoot>
						</Table>
					</Paper>

					{/* Payment Notes */}
					<Stack spacing="md">
						<Divider />

						<div>
							<Text
								size="sm"
								weight={500}
								mb="xs"
							>
								Payment Notes
							</Text>
							<Textarea
								placeholder="Enter payment details, reference numbers, or any relevant notes about this bulk payment..."
								minRows={4}
								icon={
									<IconMessageCircle
										size={16}
										className={classes.inputIcon}
									/>
								}
								{...form.getInputProps('notes')}
								radius="md"
								required
							/>
							<Text
								size="xs"
								color="dimmed"
								mt="xs"
							>
								These notes will be recorded with the payment for audit purposes.
								Include payment method, reference numbers, or any special
								instructions.
							</Text>
						</div>
					</Stack>
				</div>

				{/* Actions */}
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
							loading={bulkPaymentMutation.isLoading}
							leftIcon={<IconCash size={16} />}
							color="green"
							radius="md"
							disabled={pendingEarnings.length === 0}
						>
							Process Payment ({formatCurrency(totalAmount)})
						</Button>
					</Group>
				</div>
			</form>
		</Modal>
	);
}
