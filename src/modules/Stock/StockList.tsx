import {
	Button,
	Stack,
	Text,
	Card,
	TextInput,
	Select,
	Badge,
	ActionIcon,
	createStyles,
	Grid,
	ThemeIcon,
	Menu,
	Title,
	Group,
	Skeleton,
	Table,
	Pagination,
	Paper,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconSearch,
	IconFilter,
	IconPlus,
	IconDotsVertical,
	IconBox,
	IconBuilding,
	IconDeviceMobile,
	IconCategory,
	IconTrendingUp,
	IconSettings,
	IconTransfer,
	IconAlertTriangle,
	IconEye,
	IconDownload,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import useRequest from '../../hooks/useRequest';
import { AddStockModal } from './AddStockModal';
import { SetStockThresholdModal } from './SetStockThresholdModal';
import { StockTransferModal } from './StockTransferModal';
import { StockThresholdAlertsModal } from './StockThresholdAlertsModal';
import { Stock } from '../Dealer/types';

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

	stockLevelBadge: {
		fontWeight: 600,
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

export function StockList() {
	const { classes } = useStyles();
	const request = useRequest(true);

	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [dealerFilter, setDealerFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(12);

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [thresholdModalOpened, { open: openThresholdModal, close: closeThresholdModal }] =
		useDisclosure(false);
	const [transferModalOpened, { open: openTransferModal, close: closeTransferModal }] =
		useDisclosure(false);
	const [alertsModalOpened, { open: openAlertsModal, close: closeAlertsModal }] =
		useDisclosure(false);

	// Fetch stock summary
	const { data: stockSummary } = useQuery({
		queryKey: ['stocks/summary'],
		queryFn: () => request.get('/stocks/summary'),
	});

	// Fetch stock list
	const { data: stockData, isLoading } = useQuery({
		queryKey: [
			'stocks',
			{ categoryFilter, dealerFilter, statusFilter, searchTerm, currentPage },
		],
		queryFn: () =>
			request.get('/stocks', {
				params: {
					category: categoryFilter !== 'all' ? categoryFilter : undefined,
					dealerId: dealerFilter !== 'all' ? dealerFilter : undefined,
					status: statusFilter !== 'all' ? statusFilter : undefined,
					search: searchTerm || undefined,
					page: currentPage,
					limit: itemsPerPage,
				},
			}),
	});

	// Filter and search logic
	const filteredStocks = useMemo(() => {
		if (!stockData?.data?.data) return [];

		return stockData.data.data.filter((stock: Stock) => {
			const matchesSearch =
				stock.dealerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				stock.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				stock.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(stock.imei && stock.imei.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(stock.serialNumber &&
					stock.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));

			const matchesCategory = categoryFilter === 'all' || stock.category === categoryFilter;
			const matchesDealer = dealerFilter === 'all' || stock.dealerName === dealerFilter;
			const matchesStatus = statusFilter === 'all' || stock.status === statusFilter;

			return matchesSearch && matchesCategory && matchesDealer && matchesStatus;
		});
	}, [stockData?.data?.data, searchTerm, categoryFilter, dealerFilter, statusFilter]);

	// Get unique dealers for filter
	const uniqueDealers = useMemo(() => {
		if (!stockData?.data?.data) return [];
		const dealers = [...new Set(stockData.data.data.map((stock: Stock) => stock.dealerName))];
		return dealers.filter((dealer): dealer is string => Boolean(dealer));
	}, [stockData?.data?.data]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'available':
				return 'green';
			case 'sold':
				return 'red';
			case 'transferred':
				return 'blue';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'available':
				return <IconBox size={16} />;
			case 'sold':
				return <IconTrendingUp size={16} />;
			case 'transferred':
				return <IconTransfer size={16} />;
			default:
				return <IconBox size={16} />;
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category?.toLowerCase()) {
			case 'wakanet':
				return 'yellow';
			case 'enterprise':
				return 'purple';
			default:
				return 'gray';
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category?.toLowerCase()) {
			case 'wakanet':
				return <IconDeviceMobile size={14} />;
			case 'enterprise':
				return <IconBuilding size={14} />;
			default:
				return <IconCategory size={14} />;
		}
	};

	const handleViewDetails = (stock: Stock) => {
		// Implement stock details view
		console.log('View stock details:', stock);
	};

	const handleDownloadTemplate = () => {
		// Implement template download
		request.get('/stocks/template', { params: { format: 'csv' } });
	};

	// Pagination
	const totalPages = Math.ceil((stockData?.data?.meta?.total || 0) / itemsPerPage);

	return (
		<div className={classes.root}>
			{/* Enhanced Header */}
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
							leftIcon={<IconSettings size={16} />}
							variant="outline"
							onClick={openThresholdModal}
							size="md"
							radius="md"
						>
							Set Thresholds
						</Button>
						<Button
							leftIcon={<IconPlus size={16} />}
							onClick={openAddModal}
							size="md"
							radius="md"
						>
							Add Stock
						</Button>
					</Group>
				</Group>
			</div>

			{/* Stock Summary Cards */}
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

			{/* Search and Filter Section */}
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
						placeholder="Filter by category"
						data={[
							{ value: 'all', label: 'All Categories' },
							{ value: 'wakanet', label: 'WakaNet' },
							{ value: 'enterprise', label: 'Enterprise' },
						]}
						value={categoryFilter}
						onChange={(value) => setCategoryFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
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
							{ value: 'available', label: 'Available' },
							{ value: 'sold', label: 'Sold' },
							{ value: 'transferred', label: 'Transferred' },
						]}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
				</div>
			</div>

			{/* View Mode Toggle */}
			<div className={classes.viewModeToggle}>
				<Group position="right">
					<Button.Group>
						<Button
							variant={viewMode === 'grid' ? 'filled' : 'outline'}
							size="sm"
							onClick={() => setViewMode('grid')}
						>
							Grid View
						</Button>
						<Button
							variant={viewMode === 'table' ? 'filled' : 'outline'}
							size="sm"
							onClick={() => setViewMode('table')}
						>
							Table View
						</Button>
					</Button.Group>
				</Group>
			</div>

			{/* Stock Display */}
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
							key={stock.id}
							xs={12}
							sm={6}
							lg={4}
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
												{stock.productName}
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
													icon={<IconEye size={16} />}
													onClick={() => handleViewDetails(stock)}
												>
													View Details
												</Menu.Item>
												<Menu.Item icon={<IconSettings size={16} />}>
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
												{stock.dealerName}
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
												{stock.deviceName}
											</Text>
										</div>
										{stock.imei && (
											<div className={classes.infoRow}>
												<IconBox
													size={14}
													color="gray"
												/>
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
												<IconBox
													size={14}
													color="gray"
												/>
												<Text
													size="sm"
													className={classes.imeiCode}
												>
													{stock.serialNumber}
												</Text>
											</div>
										)}
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group position="apart">
										<Badge
											color={getStatusColor(stock.status)}
											variant="filled"
											size="sm"
											className={classes.stockLevelBadge}
											leftSection={getStatusIcon(stock.status)}
										>
											{stock.status.toUpperCase()}
										</Badge>
										<Badge
											color={getCategoryColor(stock.category)}
											variant="light"
											size="sm"
											className={classes.categoryBadge}
											leftSection={getCategoryIcon(stock.category)}
										>
											{stock.category?.charAt(0)?.toUpperCase() +
												stock.category?.slice(1)}
										</Badge>
									</Group>
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
								<th>IMEI/Serial</th>
								<th>Category</th>
								<th>Status</th>
								<th>Assigned Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredStocks.map((stock: Stock) => (
								<tr key={stock.id}>
									<td>
										<Text
											size="sm"
											weight={500}
										>
											{stock.productName}
										</Text>
									</td>
									<td>
										<Text size="sm">{stock.deviceName}</Text>
									</td>
									<td>
										<Group spacing="xs">
											<IconBuilding
												size={16}
												color="gray"
											/>
											<Text size="sm">{stock.dealerName}</Text>
										</Group>
									</td>
									<td>
										{stock.imei ? (
											<Text
												size="sm"
												className={classes.imeiCode}
											>
												{stock.imei}
											</Text>
										) : stock.serialNumber ? (
											<Text
												size="sm"
												className={classes.imeiCode}
											>
												{stock.serialNumber}
											</Text>
										) : (
											<Text
												size="sm"
												color="dimmed"
											>
												N/A
											</Text>
										)}
									</td>
									<td>
										<Badge
											color={getCategoryColor(stock.category)}
											variant="light"
											size="sm"
											leftSection={getCategoryIcon(stock.category)}
										>
											{stock.category?.charAt(0)?.toUpperCase() +
												stock.category?.slice(1)}
										</Badge>
									</td>
									<td>
										<Badge
											color={getStatusColor(stock.status)}
											variant="filled"
											size="sm"
											leftSection={getStatusIcon(stock.status)}
										>
											{stock.status.toUpperCase()}
										</Badge>
									</td>
									<td>
										<Text size="sm">
											{new Date(stock.assignedAt).toLocaleDateString()}
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
													icon={<IconEye size={16} />}
													onClick={() => handleViewDetails(stock)}
												>
													View Details
												</Menu.Item>
												<Menu.Item icon={<IconSettings size={16} />}>
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

			{/* Pagination */}
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

			{/* Modals */}
			<AddStockModal
				opened={addModalOpened}
				onClose={closeAddModal}
			/>

			<SetStockThresholdModal
				opened={thresholdModalOpened}
				onClose={closeThresholdModal}
			/>

			<StockTransferModal
				opened={transferModalOpened}
				onClose={closeTransferModal}
			/>

			<StockThresholdAlertsModal
				opened={alertsModalOpened}
				onClose={closeAlertsModal}
			/>
		</div>
	);
}
