import {
	ActionIcon,
	Badge,
	Button,
	Card,
	createStyles,
	Grid,
	Group,
	Menu,
	Pagination,
	Paper,
	Select,
	Skeleton,
	Stack,
	Table,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconAlertTriangle,
	IconBox,
	IconBuilding,
	IconDeviceMobile,
	IconDotsVertical,
	IconDownload,
	IconFilter,
	IconGauge,
	IconPlus,
	IconSearch,
	IconSettings,
	IconSwitch,
	IconTransfer,
	IconTrendingUp,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Stock } from '../Dealer/types';
import { AddStockModal } from './AddStockModal';
import { SetStockThresholdModal } from './SetStockThresholdModal';
import { StockThresholdAlertsModal } from './StockThresholdAlertsModal';
import { StockThresholdsList } from './StockThresholdsList';
import { StockTransferModal } from './StockTransferModal';

const useStyles = createStyles((theme) => ({
	root: {
		padding: 0,
	},

	header: {
		marginBottom: theme.spacing.lg,
	},

	searchSection: {
		marginBottom: theme.spacing.lg,
	},

	searchRow: {
		display: 'flex',
		gap: theme.spacing.md,
		alignItems: 'flex-end',
		flexWrap: 'wrap',
	},

	card: {
		transition: 'all 0.2s ease',
		cursor: 'pointer',
	},

	cardHeader: {
		padding: theme.spacing.md,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
	},

	cardBody: {
		padding: theme.spacing.md,
	},

	cardFooter: {
		padding: theme.spacing.md,
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	infoRow: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		marginBottom: theme.spacing.xs,
	},

	categoryBadge: {
		fontWeight: 500,
	},

	actionButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'scale(1.05)',
		},
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},

	stockProgress: {
		marginTop: theme.spacing.xs,
	},

	statsRow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing.xs,
	},

	summaryCards: {
		marginBottom: theme.spacing.lg,
	},

	summaryCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		height: '100%',
	},

	summaryValue: {
		fontSize: theme.fontSizes.xl,
		fontWeight: 700,
		marginBottom: theme.spacing.xs,
	},

	summaryLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
	},

	viewModeToggle: {
		marginBottom: theme.spacing.md,
	},

	tableContainer: {
		overflowX: 'auto',
	},

	statusBadge: {
		fontWeight: 600,
	},

	imeiCode: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		borderRadius: theme.radius.sm,
	},
}));

const statusMap = {
	1: 'Available',
	2: 'Sold',
	3: 'Transferred',
	4: 'Swapped',
};

export function StockList() {
	const { classes } = useStyles();
	const request = useRequest(true);

	const [searchTerm, setSearchTerm] = useState('');
	const [dealerFilter, setDealerFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(12);
	const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [thresholdModalOpened, { open: openThresholdModal, close: closeThresholdModal }] =
		useDisclosure(false);
	const [transferModalOpened, { open: openTransferModal, close: closeTransferModal }] =
		useDisclosure(false);
	const [alertsModalOpened, { open: openAlertsModal, close: closeAlertsModal }] =
		useDisclosure(false);
	const [thresholdsListOpened, { open: openThresholdsList, close: closeThresholdsList }] =
		useDisclosure(false);

	const { data: stockSummary } = useQuery({
		queryKey: ['stock/summary', { dealerFilter }],
		queryFn: () =>
			request.get('/stock/summary', {
				params: {
					dealerId: dealerFilter !== 'all' ? dealerFilter : undefined,
				},
			}),
	});

	const { data: stockData, isLoading } = useQuery({
		queryKey: ['stock', { dealerFilter, statusFilter, searchTerm, currentPage }],
		queryFn: () =>
			request.get('/stock', {
				params: {
					dealerId: dealerFilter !== 'all' ? dealerFilter : undefined,
					status: statusFilter !== 'all' ? parseInt(statusFilter) : undefined,
					page: currentPage,
					pageSize: itemsPerPage,
				},
			}),
	});

	const filteredStocks = useMemo(() => {
		if (!stockData?.data?.data) return [];

		return stockData.data.data.filter((stock: Stock) => {
			const matchesSearch =
				stock.dealerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				stock.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				stock.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(stock.imei && stock.imei.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(stock.serialNumber &&
					stock.serialNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()));

			const matchesDealer = dealerFilter === 'all' || stock.dealerName === dealerFilter;
			const matchesStatus = statusFilter === 'all' || stock.status === parseInt(statusFilter);

			return matchesSearch && matchesDealer && matchesStatus;
		});
	}, [stockData?.data?.data, searchTerm, dealerFilter, statusFilter]);

	const uniqueDealers = useMemo(() => {
		if (!stockData?.data?.data) return [];
		const dealers = [...new Set(stockData.data.data.map((stock: Stock) => stock.dealerName))];
		return dealers.filter((dealer): dealer is string => Boolean(dealer));
	}, [stockData?.data?.data]);

	const getStatusColor = (status: string | number) => {
		const statusStr = typeof status === 'number' ? status : status;
		switch (statusStr) {
			case 1:
				return 'green';
			case 2:
				return 'red';
			case 3:
				return 'blue';
			case 4:
				return 'yellow';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: string | number) => {
		const statusStr = typeof status === 'number' ? status : status;
		switch (statusStr) {
			case 1:
				return <IconBox size={16} />;
			case 2:
				return <IconTrendingUp size={16} />;
			case 3:
				return <IconTransfer size={16} />;
			case 4:
				return <IconSwitch size={16} />;
			default:
				return <IconBox size={16} />;
		}
	};

	const handleOpenSetThresholdModal = (stock: Stock) => {
		setSelectedStock(stock);
		openThresholdModal();
	};

	const handleDownloadTemplate = () => {
		request.get('/stocks/template', { params: { format: 'csv' } });
	};

	const totalPages = Math.ceil((stockData?.data?.meta?.total || 0) / itemsPerPage);

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<Group
					position="apart"
					mb="md"
				>
					<div>
						<Title
							order={3}
							mb="xs"
						>
							Stock Management
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Monitor and manage inventory levels across all dealers
						</Text>
					</div>
					<Group spacing="md">
						<Button
							leftIcon={<IconGauge size={16} />}
							variant="outline"
							onClick={openThresholdsList}
							size="md"
							radius="md"
							color="purple"
						>
							View Thresholds
						</Button>
						<Button
							leftIcon={<IconAlertTriangle size={16} />}
							variant="outline"
							onClick={openAlertsModal}
							size="md"
							radius="md"
							color="red"
						>
							View Alerts
						</Button>
						<Button
							leftIcon={<IconTransfer size={16} />}
							variant="outline"
							onClick={openTransferModal}
							size="md"
							radius="md"
							color="blue"
						>
							Transfer Stock
						</Button>
						<Button
							leftIcon={<IconDownload size={16} />}
							variant="outline"
							onClick={handleDownloadTemplate}
							size="md"
							radius="md"
						>
							Download Template
						</Button>
						<Button
							leftIcon={<IconPlus size={16} />}
							onClick={openAddModal}
							size="md"
							radius="md"
						>
							Add Stocks
						</Button>
					</Group>
				</Group>
			</div>

			{stockSummary?.data && (
				<div className={classes.summaryCards}>
					<Grid>
						<Grid.Col
							xs={12}
							sm={6}
							md={3}
						>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="blue"
								>
									{stockSummary.data.totalStock?.toLocaleString() || 0}
								</Text>
								<Text className={classes.summaryLabel}>Total Stock</Text>
							</Paper>
						</Grid.Col>
						<Grid.Col
							xs={12}
							sm={6}
							md={3}
						>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="green"
								>
									{stockSummary.data.availableStock?.toLocaleString() || 0}
								</Text>
								<Text className={classes.summaryLabel}>Available Stock</Text>
							</Paper>
						</Grid.Col>
						<Grid.Col
							xs={12}
							sm={6}
							md={3}
						>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="red"
								>
									{stockSummary.data.soldStock?.toLocaleString() || 0}
								</Text>
								<Text className={classes.summaryLabel}>Sold Stock</Text>
							</Paper>
						</Grid.Col>
						<Grid.Col
							xs={12}
							sm={6}
							md={3}
						>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="orange"
								>
									{stockSummary.data.byProduct?.length || 0}
								</Text>
								<Text className={classes.summaryLabel}>Active Products</Text>
							</Paper>
						</Grid.Col>
					</Grid>
				</div>
			)}

			<div className={classes.searchSection}>
				<div className={classes.searchRow}>
					<TextInput
						placeholder="Search stock..."
						icon={<IconSearch size={16} />}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.currentTarget.value)}
						style={{ flex: 1, minWidth: 250 }}
					/>
					<Select
						placeholder="Filter by dealer"
						data={[
							{ value: 'all', label: 'All Dealers' },
							...uniqueDealers.map((dealer: string) => ({
								value: dealer,
								label: dealer,
							})),
						]}
						value={dealerFilter}
						onChange={(value) => setDealerFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
					<Select
						placeholder="Filter by status"
						data={[
							{ value: 'all', label: 'All Statuses' },
							{ value: '1', label: 'Available' },
							{ value: '2', label: 'Sold' },
							{ value: '3', label: 'Transferred' },
							{ value: '4', label: 'Swapped' },
						]}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
				</div>
			</div>

			<div className={classes.viewModeToggle}>
				<Group position="right">
					<Button.Group>
						<Button
							variant={viewMode === 'table' ? 'filled' : 'outline'}
							size="sm"
							onClick={() => setViewMode('table')}
						>
							Table View
						</Button>
						<Button
							variant={viewMode === 'grid' ? 'filled' : 'outline'}
							size="sm"
							onClick={() => setViewMode('grid')}
						>
							Grid View
						</Button>
					</Button.Group>
				</Group>
			</div>

			{isLoading ? (
				<Grid>
					{Array.from({ length: 6 }).map((_, index) => (
						<Grid.Col
							key={index}
							xs={12}
							sm={6}
							lg={4}
						>
							<Card className={classes.card}>
								<Card.Section className={classes.cardHeader}>
									<Group position="apart">
										<Group spacing="xs">
											<Skeleton
												height={24}
												width={24}
												radius="xl"
											/>
											<Skeleton
												height={12}
												width={140}
											/>
										</Group>
										<Skeleton
											height={24}
											width={24}
											radius="md"
										/>
									</Group>
								</Card.Section>

								<Card.Section className={classes.cardBody}>
									<Stack spacing="xs">
										<Skeleton
											height={12}
											width="60%"
										/>
										<Skeleton
											height={12}
											width="50%"
										/>
										<Skeleton
											height={8}
											width="100%"
										/>
										<Skeleton
											height={10}
											width="30%"
										/>
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group position="apart">
										<Skeleton
											height={24}
											width={80}
											radius="xl"
										/>
										<Skeleton
											height={24}
											width={100}
											radius="xl"
										/>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			) : filteredStocks.length === 0 ? (
				<div className={classes.emptyState}>
					<IconBox
						size={48}
						color="gray"
					/>
					<Text
						size="lg"
						mt="md"
					>
						No stock found
					</Text>
					<Text
						size="sm"
						color="dimmed"
					>
						Try adjusting your search or filters
					</Text>
				</div>
			) : viewMode === 'grid' ? (
				<Grid>
					{filteredStocks.map((stock: Stock) => (
						<Grid.Col
							key={stock.imei}
							xs={12}
							sm={4}
							lg={2}
						>
							<Card className={classes.card}>
								<Card.Section className={classes.cardHeader}>
									<Group position="apart">
										<Group spacing="xs">
											<ThemeIcon
												size="md"
												radius="md"
												variant="light"
												color={getStatusColor(stock.status)}
											>
												<IconBox size={16} />
											</ThemeIcon>
											<Text
												weight={600}
												size="sm"
												lineClamp={1}
											>
												{stock.productName.toUpperCase()}
											</Text>
										</Group>
										<Menu>
											<Menu.Target>
												<ActionIcon
													variant="subtle"
													size="sm"
												>
													<IconDotsVertical size={16} />
												</ActionIcon>
											</Menu.Target>
											<Menu.Dropdown>
												<Menu.Item
													icon={<IconSettings size={16} />}
													onClick={() =>
														handleOpenSetThresholdModal(stock)
													}
												>
													Set Threshold
												</Menu.Item>
											</Menu.Dropdown>
										</Menu>
									</Group>
								</Card.Section>

								<Card.Section className={classes.cardBody}>
									<Stack spacing="xs">
										<div className={classes.infoRow}>
											<IconBuilding
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
												lineClamp={1}
											>
												{stock.dealerName.toUpperCase()}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconDeviceMobile
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
												lineClamp={1}
											>
												{stock.deviceName.toUpperCase()}
											</Text>
										</div>
										{stock.imei && (
											<div className={classes.infoRow}>
												<Text
													size="sm"
													className={classes.imeiCode}
												>
													{stock.imei}
												</Text>
											</div>
										)}
										{stock.serialNumber && (
											<div className={classes.infoRow}>
												<Text
													size="sm"
													className={classes.imeiCode}
												>
													{stock.serialNumber}
												</Text>
											</div>
										)}
									</Stack>
									<Badge
										color={getStatusColor(stock.status)}
										size="sm"
										leftSection={getStatusIcon(stock.status)}
									>
										{statusMap[stock.status as keyof typeof statusMap]}
									</Badge>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			) : (
				<div className={classes.tableContainer}>
					<Table>
						<thead>
							<tr>
								<th>Product</th>
								<th>Device</th>
								<th>Dealer</th>
								<th>IMEI</th>
								<th>Serial Number</th>
								<th>Status</th>
								<th>Assigned Date</th>
								<th>Transferred Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredStocks.map((stock: Stock) => (
								<tr key={stock.imei}>
									<td>
										<Text
											size="sm"
											weight={500}
										>
											{stock.productName.toUpperCase()}
										</Text>
									</td>
									<td>
										<Text size="sm">{stock.deviceName.toUpperCase()}</Text>
									</td>
									<td>
										<Group spacing="xs">
											<IconBuilding
												size={16}
												color="gray"
											/>
											<Text size="sm">{stock.dealerName.toUpperCase()}</Text>
										</Group>
									</td>
									<td>
										<Text
											size="sm"
											className={classes.imeiCode}
										>
											{stock.imei || 'N/A'}
										</Text>
									</td>
									<td>
										<Text
											size="sm"
											className={classes.imeiCode}
										>
											{stock.serialNumber || 'N/A'}
										</Text>
									</td>

									<td>
										<Badge
											color={getStatusColor(stock.status)}
											size="sm"
											leftSection={getStatusIcon(stock.status)}
										>
											{statusMap[stock.status as keyof typeof statusMap]}
										</Badge>
									</td>
									<td>
										<Text size="sm">
											{new Date(stock.assignedAt).toLocaleDateString()}
										</Text>
									</td>
									<td>
										<Text size="sm">
											{stock.transferedOn
												? new Date(stock.transferedOn).toLocaleDateString()
												: 'N/A'}
										</Text>
									</td>
									<td>
										<Menu>
											<Menu.Target>
												<ActionIcon
													variant="subtle"
													size="sm"
												>
													<IconDotsVertical size={16} />
												</ActionIcon>
											</Menu.Target>
											<Menu.Dropdown>
												<Menu.Item
													icon={<IconSettings size={16} />}
													onClick={() =>
														handleOpenSetThresholdModal(stock)
													}
												>
													Set Threshold
												</Menu.Item>
											</Menu.Dropdown>
										</Menu>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			)}

			{totalPages > 1 && (
				<Group
					position="center"
					mt="xl"
				>
					<Pagination
						total={totalPages}
						value={currentPage}
						onChange={setCurrentPage}
						size="sm"
					/>
				</Group>
			)}

			<AddStockModal
				opened={addModalOpened}
				onClose={closeAddModal}
			/>

			<SetStockThresholdModal
				opened={thresholdModalOpened}
				onClose={closeThresholdModal}
				stock={selectedStock as Stock}
			/>

			<StockTransferModal
				opened={transferModalOpened}
				onClose={closeTransferModal}
			/>

			<StockThresholdAlertsModal
				opened={alertsModalOpened}
				onClose={closeAlertsModal}
			/>

			<StockThresholdsList
				opened={thresholdsListOpened}
				onClose={closeThresholdsList}
			/>
		</div>
	);
}
