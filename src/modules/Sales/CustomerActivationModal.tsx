import { Box, Button, Divider, Group, Stack, Text, ThemeIcon, createStyles } from '@mantine/core';
import { IconDeviceMobile, IconHash, IconPhone, IconReceipt, IconUser } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import {
	CustomerActivationModalProps,
	CustomerActivationRequest,
	CustomerActivationResponse,
} from '../Dealer/types';

const useStyles = createStyles((theme) => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
		marginBottom: theme.spacing.xl,
	},
	content: {
		padding: `0 ${theme.spacing.xs}`,
	},
	section: {
		marginBottom: theme.spacing.xl,
	},
	sectionTitle: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		marginBottom: theme.spacing.md,
		fontSize: theme.fontSizes.sm,
		fontWeight: 600,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
	},
	infoItem: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
		padding: theme.spacing.sm,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
		}`,
	},
	iconWrapper: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},
	labelText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		fontWeight: 500,
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
	},
	valueText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
	},
	actions: {
		padding: theme.spacing.md,
		paddingBottom: theme.spacing.lg,
		borderTop: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},
	statusCard: {
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.blue[9] : theme.colors.blue[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[2]
		}`,
		marginBottom: theme.spacing.lg,
	},
}));

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	className?: string;
}

function InfoItem({ icon, label, value, className }: InfoItemProps) {
	const { classes } = useStyles();

	return (
		<div className={`${classes.infoItem} ${className || ''}`}>
			<div className={classes.iconWrapper}>{icon}</div>
			<Box style={{ flex: 1 }}>
				<Text className={classes.labelText}>{label}</Text>
				<Text className={classes.valueText}>{value || 'Not specified'}</Text>
			</Box>
		</div>
	);
}

export function CustomerActivationModal({
	opened,
	onClose,
	transaction,
}: CustomerActivationModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const { data: agentsData } = useQuery({
		queryKey: ['agents'],
		queryFn: () => request.get('/agents', { params: { status: 'active' } }),
	});

	// Find agent name from agentsData
	const getAgentName = (agentId: number) => {
		const agent = agentsData?.data?.data?.find((a: any) => a.id === agentId);
		return agent?.agentName?.toUpperCase() || 'Unknown Agent';
	};

	const activationMutation = useMutation({
		mutationFn: async (_data: CustomerActivationRequest) => {
			const response = await request.post('/transactions/activation', {
				agentId: transaction?.agentId || 0,
				receiptNumber: transaction?.receiptNumber || '',
				imei: transaction?.imei || '',
				customerId: transaction?.customerId || '',
				customerName: transaction?.customerName || '',
				customerPhone: transaction?.customerPhone || '',
			});
			return response.data as CustomerActivationResponse;
		},
		onSuccess: (data) => {
			console.log('Activation successful:', data);
			queryClient.invalidateQueries(['transactions']);
			queryClient.invalidateQueries(['transactionSummary']);

			if (transaction) {
				alert(
					`Successfully activated transaction ${transaction.receiptNumber || transaction.id} for ${transaction.customerName}`
				);
			} else {
				alert('Successfully recorded new activation');
			}
			onClose();
		},
		onError: (error) => {
			console.error('Activation failed:', error);
		},
	});

	const handleActivate = () => {
		if (transaction) {
			activationMutation.mutate({
				agentId: transaction.agentId,
				receiptNumber: transaction.receiptNumber || '',
				imei: transaction.imei,
				customerId: transaction.customerId || '',
				customerName: transaction.customerName || '',
				customerPhone: transaction.customerPhone,
			});
		}
	};

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
		>
			<div
				className={classes.header}
				style={{ padding: '24px 24px 0', marginBottom: 0 }}
			>
				<ThemeIcon
					size="lg"
					radius="md"
					color="green"
				>
					<IconDeviceMobile size={24} />
				</ThemeIcon>
				<div>
					<Text
						size="lg"
						weight={600}
					>
						Activate Transaction
					</Text>
					<Text
						color="dimmed"
						size="sm"
					>
						Review transaction details before activation
					</Text>
				</div>
			</div>

			<div className={classes.content}>
				<div className={classes.statusCard}>
					<Text
						size="sm"
						weight={500}
						mb="xs"
					>
						📋 Ready for Activation
					</Text>
					<Text
						size="xs"
						color="dimmed"
					>
						Transaction {transaction?.receiptNumber || transaction?.id} for customer{' '}
						{transaction?.customerName}. This will activate the customer's device on the
						network.
					</Text>
				</div>

				<Stack spacing="lg">
					<div className={classes.section}>
						<Text className={classes.sectionTitle}>
							<IconUser size={16} />
							Agent Information
						</Text>
						<InfoItem
							icon={<IconUser size={16} />}
							label="Agent"
							value={getAgentName(transaction?.agentId || 0)}
						/>
					</div>

					<Divider />

					<div className={classes.section}>
						<Text className={classes.sectionTitle}>
							<IconReceipt size={16} />
							Transaction Details
						</Text>
						<Stack spacing="sm">
							<InfoItem
								icon={<IconReceipt size={16} />}
								label="Receipt Number"
								value={transaction?.receiptNumber || ''}
							/>
							<InfoItem
								icon={<IconHash size={16} />}
								label="IMEI"
								value={transaction?.imei || ''}
							/>
						</Stack>
					</div>

					<Divider />

					<div className={classes.section}>
						<Text className={classes.sectionTitle}>
							<IconUser size={16} />
							Customer Information
						</Text>
						<Stack spacing="sm">
							<InfoItem
								icon={<IconHash size={16} />}
								label="Customer ID"
								value={transaction?.customerId || 'Not provided'}
							/>
							<InfoItem
								icon={<IconUser size={16} />}
								label="Customer Name"
								value={transaction?.customerName || ''}
							/>
							<InfoItem
								icon={<IconPhone size={16} />}
								label="Customer Phone"
								value={transaction?.customerPhone || ''}
							/>
						</Stack>
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
						onClick={handleActivate}
						loading={activationMutation.isLoading}
						leftIcon={<IconDeviceMobile size={16} />}
						radius="md"
						color="green"
					>
						Activate Transaction
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
