import {
	ActionIcon,
	Alert,
	Badge,
	createStyles,
	Group,
	Modal,
	Paper,
	Stack,
	Table,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import {
	IconAlertTriangle,
	IconBuilding,
	IconEye,
	IconPackage,
	IconTrendingDown,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { StockThresholdAlert } from '../Dealer/types';

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

	summaryCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	summaryRow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing.xs,
	},

	alertTable: {
		marginTop: theme.spacing.md,
	},

	statusBadge: {
		fontWeight: 600,
	},

	shortfallBadge: {
		fontWeight: 600,
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},

	detailModal: {
		'& .mantine-Modal-body': {
			padding: 0,
		},
	},

	detailContent: {
		padding: theme.spacing.lg,
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
}));

interface StockThresholdAlertsModalProps {
	opened: boolean;
	onClose: () => void;
}

export function StockThresholdAlertsModal({ opened, onClose }: StockThresholdAlertsModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const [selectedAlert, setSelectedAlert] = useState<StockThresholdAlert | null>(null);
	const [detailModalOpened, setDetailModalOpened] = useState(false);

	const { data: alertsData, isLoading } = useQuery({
		queryKey: [
			'stock-thresholds',
			{ dealerId: undefined, category: undefined, belowThreshold: true },
		],
		queryFn: () =>
			request.get('/stock-thresholds', {
				params: {
					belowThreshold: true,
				},
			}),
	});

	const alerts = alertsData?.data?.alerts || [];
	const totalAlerts = alertsData?.data?.totalAlerts || 0;

	const handleViewDetails = (alert: StockThresholdAlert) => {
		setSelectedAlert(alert);
		setDetailModalOpened(true);
	};

	const closeDetailModal = () => {
		setDetailModalOpened(false);
		setSelectedAlert(null);
	};

	const getShortfallColor = (shortfall: number) => {
		if (shortfall <= 10) return 'yellow';
		if (shortfall <= 50) return 'orange';
		return 'red';
	};

	const getShortfallSeverity = (shortfall: number) => {
		if (shortfall <= 10) return 'Low';
		if (shortfall <= 50) return 'Medium';
		return 'High';
	};

	return (
		<>
			<Modal
				opened={opened}
				onClose={onClose}
				size="xl"
				title="Stock Threshold Alerts"
				centered
			>
				{/* Header */}
				<div className={classes.header}>
					<div className={classes.headerContent}>
						<ThemeIcon
							size={40}
							radius="md"
							variant="light"
							color="red"
						>
							<IconAlertTriangle size={20} />
						</ThemeIcon>
						<div>
							<Title
								order={3}
								size="h4"
							>
								Stock Threshold Alerts
							</Title>
							<Text
								color="dimmed"
								size="sm"
							>
								Monitor stock levels that have fallen below configured thresholds
							</Text>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className={classes.content}>
					{/* Summary Card */}
					<Paper
						className={classes.summaryCard}
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
								Alert Summary
							</Text>
							<Badge
								color="red"
								size="lg"
								variant="light"
							>
								{totalAlerts} Active Alerts
							</Badge>
						</Group>

						<div className={classes.summaryRow}>
							<Text
								size="sm"
								color="dimmed"
							>
								Total Dealers Affected:
							</Text>
							<Text
								size="sm"
								weight={600}
							>
								{
									new Set(
										alerts.map((alert: StockThresholdAlert) => alert.dealerId)
									).size
								}
							</Text>
						</div>

						<div className={classes.summaryRow}>
							<Text
								size="sm"
								color="dimmed"
							>
								Total Products Affected:
							</Text>
							<Text
								size="sm"
								weight={600}
							>
								{
									new Set(
										alerts.map(
											(alert: StockThresholdAlert) => alert.productName
										)
									).size
								}
							</Text>
						</div>

						<div className={classes.summaryRow}>
							<Text
								size="sm"
								color="dimmed"
							>
								Average Shortfall:
							</Text>
							<Text
								size="sm"
								weight={600}
							>
								{alerts.length > 0
									? Math.round(
											alerts.reduce(
												(sum: number, alert: StockThresholdAlert) =>
													sum + alert.shortfall,
												0
											) / alerts.length
										)
									: 0}{' '}
								units
							</Text>
						</div>
					</Paper>

					{/* Alerts Table */}
					{isLoading ? (
						<Stack spacing="md">
							{Array.from({ length: 3 }).map((_, index) => (
								<Paper
									key={index}
									p="md"
									withBorder
								>
									<Group position="apart">
										<Stack spacing="xs">
											<Text size="sm">Loading...</Text>
											<Text
												size="xs"
												color="dimmed"
											>
												Loading...
											</Text>
										</Stack>
										<Badge>Loading...</Badge>
									</Group>
								</Paper>
							))}
						</Stack>
					) : alerts.length === 0 ? (
						<div className={classes.emptyState}>
							<IconPackage
								size={48}
								color="gray"
							/>
							<Text
								size="lg"
								mt="md"
							>
								No Alerts Found
							</Text>
							<Text
								size="sm"
								color="dimmed"
							>
								All stock levels are above their configured thresholds
							</Text>
						</div>
					) : (
						<Table className={classes.alertTable}>
							<thead>
								<tr>
									<th>Dealer</th>
									<th>Product</th>
									<th>Device</th>
									<th>Current Stock</th>
									<th>Threshold</th>
									<th>Shortfall</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{alerts.map((alert: StockThresholdAlert, index: number) => (
									<tr key={index}>
										<td>
											<Group spacing="xs">
												<IconBuilding
													size={16}
													color="gray"
												/>
												<Text size="sm">{alert.dealerName}</Text>
											</Group>
										</td>
										<td>
											<Text size="sm">{alert.productName}</Text>
										</td>
										<td>
											<Text size="sm">{alert.deviceName}</Text>
										</td>
										<td>
											<Badge
												color="red"
												variant="light"
												className={classes.statusBadge}
											>
												{alert.currentStock}
											</Badge>
										</td>
										<td>
											<Text size="sm">{alert.threshold}</Text>
										</td>
										<td>
											<Badge
												color={getShortfallColor(alert.shortfall)}
												variant="filled"
												className={classes.shortfallBadge}
											>
												{alert.shortfall} (
												{getShortfallSeverity(alert.shortfall)})
											</Badge>
										</td>
										<td>
											<ActionIcon
												color="blue"
												variant="subtle"
												onClick={() => handleViewDetails(alert)}
											>
												<IconEye size={16} />
											</ActionIcon>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					)}
				</div>
			</Modal>

			{/* Detail Modal */}
			<Modal
				opened={detailModalOpened}
				onClose={closeDetailModal}
				title="Alert Details"
				size="md"
				className={classes.detailModal}
				centered
			>
				{selectedAlert && (
					<div className={classes.detailContent}>
						<Stack spacing="md">
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Dealer:</Text>
								<Text className={classes.detailValue}>
									{selectedAlert.dealerName}
								</Text>
							</div>
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Product:</Text>
								<Text className={classes.detailValue}>
									{selectedAlert.productName}
								</Text>
							</div>
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Device:</Text>
								<Text className={classes.detailValue}>
									{selectedAlert.deviceName}
								</Text>
							</div>
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Current Stock:</Text>
								<Badge
									color="red"
									variant="light"
									size="lg"
								>
									{selectedAlert.currentStock}
								</Badge>
							</div>
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Threshold:</Text>
								<Badge
									color="green"
									variant="light"
									size="lg"
								>
									{selectedAlert.threshold}
								</Badge>
							</div>
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Shortfall:</Text>
								<Badge
									color={getShortfallColor(selectedAlert.shortfall)}
									variant="filled"
									size="lg"
								>
									{selectedAlert.shortfall} units
								</Badge>
							</div>
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Severity:</Text>
								<Badge
									color={getShortfallColor(selectedAlert.shortfall)}
									variant="light"
									size="lg"
								>
									{getShortfallSeverity(selectedAlert.shortfall)}
								</Badge>
							</div>
						</Stack>

						<Alert
							icon={<IconTrendingDown size={16} />}
							title="Action Required"
							color="red"
							mt="lg"
						>
							Stock level is {selectedAlert.shortfall} units below the threshold.
							Consider restocking or adjusting the threshold.
						</Alert>
					</div>
				)}
			</Modal>
		</>
	);
}
