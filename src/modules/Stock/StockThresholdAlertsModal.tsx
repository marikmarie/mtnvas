import {
	ActionIcon,
	Badge,
	createStyles,
	Group,
	Modal,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle, IconBuilding, IconEye, IconPackage } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
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
	const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] =
		useDisclosure(false);

	const { data: alertsData, isLoading } = useQuery({
		queryKey: ['stock-threshold-alerts'],
		queryFn: () => request.get('/stock/threshold-alerts'),
	});

	const alerts: StockThresholdAlert[] = alertsData?.data?.data || [];

	const getShortfallColor = (shortfall: number) => {
		if (shortfall <= 5) return 'red';
		if (shortfall <= 10) return 'orange';
		return 'yellow';
	};

	const getShortfallSeverity = (shortfall: number) => {
		if (shortfall <= 5) return 'Critical';
		if (shortfall <= 10) return 'High';
		return 'Medium';
	};

	const handleViewDetails = (alert: StockThresholdAlert) => {
		setSelectedAlert(alert);
		openDetailModal();
	};

	const columns = [
		{
			name: 'dealerName',
			header: 'Dealer',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: StockThresholdAlert }) => (
				<Group spacing="xs">
					<IconBuilding
						size={16}
						color="gray"
					/>
					<Text size="sm">{data.dealerName}</Text>
				</Group>
			),
		},
		{
			name: 'productName',
			header: 'Product',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: StockThresholdAlert }) => (
				<Text size="sm">{data.productName}</Text>
			),
		},
		{
			name: 'deviceName',
			header: 'Device',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: StockThresholdAlert }) => (
				<Text size="sm">{data.deviceName}</Text>
			),
		},
		{
			name: 'currentStock',
			header: 'Current Stock',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockThresholdAlert }) => (
				<Badge
					color="red"
					variant="light"
					className={classes.statusBadge}
				>
					{data.currentStock}
				</Badge>
			),
		},
		{
			name: 'threshold',
			header: 'Threshold',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: StockThresholdAlert }) => (
				<Text size="sm">{data.threshold}</Text>
			),
		},
		{
			name: 'shortfall',
			header: 'Shortfall',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockThresholdAlert }) => (
				<Badge
					color={getShortfallColor(data.shortfall)}
					variant="filled"
					className={classes.shortfallBadge}
				>
					{data.shortfall} ({getShortfallSeverity(data.shortfall)})
				</Badge>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			minWidth: 80,
			render: ({ data }: { data: StockThresholdAlert }) => (
				<ActionIcon
					color="blue"
					variant="subtle"
					onClick={() => handleViewDetails(data)}
				>
					<IconEye size={16} />
				</ActionIcon>
			),
		},
	];

	const alertsTable = useDataGridTable<StockThresholdAlert>({
		columns,
		data: alerts,
		loading: isLoading,
		mih: '40vh',
	});

	return (
		<>
			<Modal
				opened={opened}
				onClose={onClose}
				title="Stock Threshold Alerts"
				size="xl"
				centered
			>
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

				<div className={classes.content}>
					{alerts.length === 0 ? (
						<div className={classes.emptyState}>
							<IconPackage
								size={48}
								color="green"
							/>
							<Text
								size="lg"
								mt="md"
								color="green"
							>
								All Good!
							</Text>
							<Text
								size="sm"
								color="dimmed"
							>
								All stock levels are above their configured thresholds
							</Text>
						</div>
					) : (
						<div className={classes.alertTable}>{alertsTable}</div>
					)}
				</div>
			</Modal>

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
									className={classes.statusBadge}
								>
									{selectedAlert.currentStock}
								</Badge>
							</div>
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Threshold:</Text>
								<Text className={classes.detailValue}>
									{selectedAlert.threshold}
								</Text>
							</div>
							<div className={classes.detailRow}>
								<Text className={classes.detailLabel}>Shortfall:</Text>
								<Badge
									color={getShortfallColor(selectedAlert.shortfall)}
									variant="filled"
									className={classes.shortfallBadge}
								>
									{selectedAlert.shortfall} (
									{getShortfallSeverity(selectedAlert.shortfall)})
								</Badge>
							</div>
						</Stack>
					</div>
				)}
			</Modal>
		</>
	);
}
