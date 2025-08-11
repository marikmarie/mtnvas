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
	Progress,
	Group,
	Skeleton,
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
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import useRequest from '../../hooks/useRequest';
import { AddStockModal } from './AddStockModal';
import { SetStockThresholdModal } from './SetStockThresholdModal';
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
}));

export function StockList() {
	const { classes } = useStyles();
	const request = useRequest(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [dealerFilter, setDealerFilter] = useState<string>('all');

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [thresholdModalOpened, { open: openThresholdModal, close: closeThresholdModal }] =
		useDisclosure(false);

	const { data: stockData, isLoading } = useQuery({
		queryKey: ['stocks'],
		queryFn: () => request.get('/stocks'),
	});

	// Filter and search logic
	const filteredStocks = useMemo(() => {
		if (!stockData?.data?.data) return [];

		return stockData.data.data.filter((stock: Stock) => {
			const matchesSearch =
				stock.dealerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				stock.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				stock.deviceName?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory = categoryFilter === 'all' || stock.category === categoryFilter;
			const matchesDealer = dealerFilter === 'all' || stock.dealerName === dealerFilter;

			return matchesSearch && matchesCategory && matchesDealer;
		});
	}, [stockData?.data?.data, searchTerm, categoryFilter, dealerFilter]);

	// Get unique dealers for filter
	const uniqueDealers = useMemo(() => {
		if (!stockData?.data?.data) return [];
		const dealers = [...new Set(stockData.data.data.map((stock: Stock) => stock.dealerName))];
		return dealers.filter((dealer): dealer is string => Boolean(dealer));
	}, [stockData?.data?.data]);

	const getStockLevelColor = (quantity: number, sold: number) => {
		const available = quantity - sold;
		const percentage = quantity > 0 ? (available / quantity) * 100 : 0;

		if (percentage >= 70) return 'yellow';
		if (percentage >= 30) return 'orange';
		return 'red';
	};

	const getStockLevelText = (quantity: number, sold: number) => {
		const available = quantity - sold;
		const percentage = quantity > 0 ? (available / quantity) * 100 : 0;

		if (percentage >= 70) return 'High';
		if (percentage >= 30) return 'Medium';
		return 'Low';
	};

	const getCategoryColor = (category: string) => {
		switch (category?.toLowerCase()) {
			case 'wakanet':
				return 'yellow';
			case 'enterprise':
				return 'purple';
			case 'both':
				return 'orange';
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
			case 'both':
				return <IconCategory size={14} />;
			default:
				return <IconCategory size={14} />;
		}
	};

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
							{ value: 'both', label: 'Both' },
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
				</div>
			</div>

			{/* Enhanced Card Grid */}
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
			) : (
				<Grid>
					{filteredStocks.map((stock: Stock) => {
						const available = stock.quantity - stock.sold;
						const percentage =
							stock.quantity > 0 ? (available / stock.quantity) * 100 : 0;

						return (
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
													color={getStockLevelColor(
														stock.quantity,
														stock.sold
													)}
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
													<Menu.Item icon={<IconTrendingUp size={16} />}>
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
											<div className={classes.statsRow}>
												<Text
													size="sm"
													color="dimmed"
												>
													Available:
												</Text>
												<Text
													size="sm"
													weight={600}
												>
													{available.toLocaleString()}
												</Text>
											</div>
											<div className={classes.statsRow}>
												<Text
													size="sm"
													color="dimmed"
												>
													Sold:
												</Text>
												<Text
													size="sm"
													weight={600}
												>
													{stock.sold.toLocaleString()}
												</Text>
											</div>
											<div className={classes.stockProgress}>
												<Progress
													value={percentage}
													color={getStockLevelColor(
														stock.quantity,
														stock.sold
													)}
													size="sm"
													radius="md"
												/>
												<Text
													size="xs"
													color="dimmed"
													mt={4}
													ta="center"
												>
													{percentage.toFixed(1)}% available
												</Text>
											</div>
										</Stack>
									</Card.Section>

									<Card.Section className={classes.cardFooter}>
										<Group position="apart">
											<Badge
												color={getStockLevelColor(
													stock.quantity,
													stock.sold
												)}
												variant="filled"
												size="sm"
												className={classes.stockLevelBadge}
											>
												{getStockLevelText(stock.quantity, stock.sold)}
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
						);
					})}
				</Grid>
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
		</div>
	);
}
