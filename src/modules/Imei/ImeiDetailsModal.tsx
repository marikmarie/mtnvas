import { Badge, createStyles, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
	IconAlertCircle,
	IconBuilding,
	IconCalendar,
	IconCheck,
	IconClock,
	IconDeviceMobile,
	IconRefresh,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { ImeiDetails, ImeiDetailsModalProps, ImeiSwap } from '../Dealer/types';

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
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
		borderRadius: theme.radius.md,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
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

export function ImeiDetailsModal({ opened, close, imei }: ImeiDetailsModalProps) {
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

	const history: ImeiSwap[] = swapHistory?.data?.data || [];

	const details: ImeiDetails | undefined = imeiDetails?.data?.data;

	const getStatusColor = (status: 'Available' | 'Sold' | 'Transferred' | 'Swapped') => {
		switch (status) {
			case 'Available':
				return 'green';
			case 'Sold':
				return 'blue';
			case 'Transferred':
				return 'orange';
			case 'Swapped':
				return 'red';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: 'Available' | 'Sold' | 'Transferred' | 'Swapped') => {
		switch (status) {
			case 'Available':
				return <IconCheck size={14} />;
			case 'Sold':
				return <IconCheck size={14} />;
			case 'Transferred':
				return <IconClock size={14} />;
			case 'Swapped':
				return <IconX size={14} />;
			default:
				return <IconAlertCircle size={14} />;
		}
	};

	const columns = [
		{
			name: 'oldImei',
			header: 'Old IMEI',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: ImeiSwap }) => (
				<Text
					size="sm"
					className={classes.imeiCode}
				>
					{data.oldImei}
				</Text>
			),
		},
		{
			name: 'newImei',
			header: 'New IMEI',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: ImeiSwap }) => (
				<Text
					size="sm"
					className={classes.imeiCode}
				>
					{data.newImei}
				</Text>
			),
		},
		{
			name: 'agentName',
			header: 'Agent',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: ImeiSwap }) => (
				<Text size="sm">{data.agentName || 'N/A'}</Text>
			),
		},
		{
			name: 'reason',
			header: 'Reason',
			defaultFlex: 1,
			minWidth: 200,
			render: ({ data }: { data: ImeiSwap }) => (
				<Text
					size="sm"
					lineClamp={2}
				>
					{data.reason}
				</Text>
			),
		},
		{
			name: 'swappedAt',
			header: 'Swapped Date',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: ImeiSwap }) => (
				<Text size="sm">{new Date(data.swappedAt).toLocaleDateString()}</Text>
			),
		},
		{
			name: 'approvedBy',
			header: 'Approved By',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: ImeiSwap }) => <Text size="sm">{data.approvedBy}</Text>,
		},
	];

	const historyTable = useDataGridTable<ImeiSwap>({
		columns,
		data: history,
		loading: false,
		mih: '30vh',
	});

	return (
		<Modal
			opened={opened}
			close={close}
			size="xl"
		>
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

			<div className={classes.content}>
				{isLoading ? (
					<Stack spacing="md">
						<Text>Loading IMEI details...</Text>
					</Stack>
				) : details ? (
					<>
						<Paper
							p={16}
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
									size="sm"
									className={classes.statusBadge}
									leftSection={getStatusIcon(details.status)}
								>
									{details.status}
								</Badge>
							</Group>

							<Stack spacing="sm">
								<div className={classes.detailRow}>
									<Text className={classes.detailLabel}>IMEI:</Text>
									<Text className={classes.imeiCode}>{details.imei}</Text>
								</div>
								{details.productId && (
									<div className={classes.detailRow}>
										<Text className={classes.detailLabel}>Product:</Text>
										<Text className={classes.detailValue}>
											{details.productName.toUpperCase()}
										</Text>
									</div>
								)}
								{details.deviceId && (
									<div className={classes.detailRow}>
										<Text className={classes.detailLabel}>Device:</Text>
										<Text className={classes.detailValue}>
											{details.deviceName.toUpperCase()}
										</Text>
									</div>
								)}
								{details.dealerName && (
									<div className={classes.detailRow}>
										<Text className={classes.detailLabel}>Sold By:</Text>
										<Group spacing="xs">
											<IconBuilding
												size={16}
												color="gray"
											/>
											<Text className={classes.detailValue}>
												{details.dealerName.toUpperCase()}
											</Text>
										</Group>
									</div>
								)}
								{details.currentAgentId && (
									<div className={classes.detailRow}>
										<Text className={classes.detailLabel}>Assigned To:</Text>
										<Group spacing="xs">
											<IconUser
												size={16}
												color="gray"
											/>
											<Text className={classes.detailValue}>
												{details.currentAgentId.toString().toUpperCase()}
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
								{details.updatedAt && (
									<div className={classes.detailRow}>
										<Text className={classes.detailLabel}>Last Swapped:</Text>
										<Group spacing="xs">
											<IconRefresh
												size={16}
												color="gray"
											/>
											<Text className={classes.detailValue}>
												{new Date(details.updatedAt).toLocaleString()}
											</Text>
										</Group>
									</div>
								)}
							</Stack>
						</Paper>

						<Group
							position="apart"
							mb="md"
						>
							<Text
								size="lg"
								mt={16}
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
							<div className={classes.historyTable}>{historyTable}</div>
						)}
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
