import {
	Group,
	Stack,
	Text,
	Badge,
	createStyles,
	ThemeIcon,
	Table,
	Modal,
	Paper,
	Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import {
	IconDeviceMobile,
	IconUser,
	IconCalendar,
	IconBuilding,
	IconRefresh,
	IconCheck,
	IconX,
	IconAlertCircle,
	IconClock,
} from '@tabler/icons-react';
import useRequest from '../../hooks/useRequest';
import { ImeiDetails, ImeiSwap, ImeiDetailsModalProps } from '../Dealer/types';

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

	detailCard: {
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

	statusBadge: {
		fontWeight: 600,
	},

	imeiCode: {
		fontFamily: 'monospace',
		fontSize: '1.1rem',
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
	},

	historyTable: {
		marginTop: theme.spacing.md,
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},
}));

export function ImeiDetailsModal({ opened, onClose, imei }: ImeiDetailsModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const { data: imeiDetails, isLoading } = useQuery({
		queryKey: ['imei-details', imei],
		queryFn: () => request.get(`/imeis/${imei}`),
		enabled: opened && !!imei,
	});

	const { data: swapHistory } = useQuery({
		queryKey: ['imei-swap-history', imei],
		queryFn: () => request.get(`/imeis/${imei}/swap-history`),
		enabled: opened && !!imei,
	});

	const details: ImeiDetails | undefined = imeiDetails?.data;
	const history: ImeiSwap[] = swapHistory?.data || details?.swapHistory || [];

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'available':
				return 'green';
			case 'active':
				return 'blue';
			case 'assigned':
				return 'orange';
			case 'inactive':
				return 'red';
			case 'swapped':
				return 'purple';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'available':
				return <IconCheck size={14} />;
			case 'active':
				return <IconCheck size={14} />;
			case 'assigned':
				return <IconClock size={14} />;
			case 'inactive':
				return <IconX size={14} />;
			case 'swapped':
				return <IconRefresh size={14} />;
			default:
				return <IconAlertCircle size={14} />;
		}
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			size="xl"
			title="IMEI Details"
		>
			{/* Header */}
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color="blue"
					>
						<IconDeviceMobile size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							IMEI Information
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Detailed information and history for IMEI: {imei}
						</Text>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className={classes.content}>
				{isLoading ? (
					<Stack spacing="md">
						<Text>Loading IMEI details...</Text>
					</Stack>
				) : details ? (
					<>
						{/* IMEI Basic Information */}
						<Paper
							className={classes.detailCard}
							shadow="xs"
						>
							<Group
								position="apart"
								mb="md"
							>
								<Text
									size="lg"
									weight={600}
								>
									Basic Information
								</Text>
								<Badge
									color={getStatusColor(details.status)}
									variant="filled"
									size="lg"
									className={classes.statusBadge}
									leftSection={getStatusIcon(details.status)}
								>
									{details.status.toUpperCase()}
								</Badge>
							</Group>

							<Stack spacing="sm">
								<div className={classes.detailRow}>
									<Text className={classes.detailLabel}>IMEI Number:</Text>
									<Text className={classes.imeiCode}>{details.imei}</Text>
								</div>
								<div className={classes.detailRow}>
									<Text className={classes.detailLabel}>Product:</Text>
									<Text className={classes.detailValue}>
										{details.productName}
									</Text>
								</div>
								<div className={classes.detailRow}>
									<Text className={classes.detailLabel}>Device:</Text>
									<Text className={classes.detailValue}>
										{details.deviceName}
									</Text>
								</div>
								<div className={classes.detailRow}>
									<Text className={classes.detailLabel}>Dealer:</Text>
									<Group spacing="xs">
										<IconBuilding
											size={16}
											color="gray"
										/>
										<Text className={classes.detailValue}>
											{details.dealerName}
										</Text>
									</Group>
								</div>
								{details.agentName && (
									<div className={classes.detailRow}>
										<Text className={classes.detailLabel}>Agent:</Text>
										<Group spacing="xs">
											<IconUser
												size={16}
												color="gray"
											/>
											<Text className={classes.detailValue}>
												{details.agentName}
											</Text>
										</Group>
									</div>
								)}
								{details.activatedAt && (
									<div className={classes.detailRow}>
										<Text className={classes.detailLabel}>Activated:</Text>
										<Group spacing="xs">
											<IconCalendar
												size={16}
												color="gray"
											/>
											<Text className={classes.detailValue}>
												{new Date(details.activatedAt).toLocaleString()}
											</Text>
										</Group>
									</div>
								)}
								{details.lastSwapDate && (
									<div className={classes.detailRow}>
										<Text className={classes.detailLabel}>Last Swapped:</Text>
										<Group spacing="xs">
											<IconRefresh
												size={16}
												color="gray"
											/>
											<Text className={classes.detailValue}>
												{new Date(details.lastSwapDate).toLocaleString()}
											</Text>
										</Group>
									</div>
								)}
							</Stack>
						</Paper>

						{/* Swap History */}
						<Paper
							className={classes.detailCard}
							shadow="xs"
						>
							<Group
								position="apart"
								mb="md"
							>
								<Text
									size="lg"
									weight={600}
								>
									Swap History
								</Text>
								<Badge
									color="gray"
									variant="light"
								>
									{history.length} Records
								</Badge>
							</Group>

							{history.length === 0 ? (
								<div className={classes.emptyState}>
									<IconRefresh
										size={48}
										color="gray"
									/>
									<Text
										size="lg"
										mt="md"
									>
										No Swap History
									</Text>
									<Text
										size="sm"
										color="dimmed"
									>
										This IMEI has not been swapped yet
									</Text>
								</div>
							) : (
								<Table className={classes.historyTable}>
									<thead>
										<tr>
											<th>Old IMEI</th>
											<th>New IMEI</th>
											<th>Agent</th>
											<th>Reason</th>
											<th>Swapped Date</th>
											<th>Approved By</th>
										</tr>
									</thead>
									<tbody>
										{history.map((swap, index) => (
											<tr key={index}>
												<td>
													<Text
														size="sm"
														className={classes.imeiCode}
													>
														{swap.oldImei}
													</Text>
												</td>
												<td>
													<Text
														size="sm"
														className={classes.imeiCode}
													>
														{swap.newImei}
													</Text>
												</td>
												<td>
													<Text size="sm">{swap.agentName}</Text>
												</td>
												<td>
													<Text
														size="sm"
														lineClamp={2}
													>
														{swap.reason}
													</Text>
												</td>
												<td>
													<Text size="sm">
														{new Date(
															swap.swappedAt
														).toLocaleDateString()}
													</Text>
												</td>
												<td>
													<Text size="sm">{swap.approvedBy}</Text>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							)}
						</Paper>
					</>
				) : (
					<div className={classes.emptyState}>
						<IconAlertCircle
							size={48}
							color="gray"
						/>
						<Text
							size="lg"
							mt="md"
						>
							IMEI Not Found
						</Text>
						<Text
							size="sm"
							color="dimmed"
						>
							The requested IMEI could not be found or you don't have access to it
						</Text>
					</div>
				)}
			</div>
		</Modal>
	);
}
