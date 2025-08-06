import {
	Button,
	Group,
	Stack,
	Text,
	Card,
	TextInput,
	Select,
	Badge,
	ActionIcon,
	Tooltip,
	createStyles,
	Grid,
	ThemeIcon,
	Menu,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconUserPlus,
	IconSearch,
	IconFilter,
	IconPlus,
	IconDotsVertical,
	IconBuildingStore,
	IconMapPin,
	IconGlobe,
	IconUser,
	IconCheck,
	IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import useRequest from '../../hooks/useRequest';
import { AddShopModal } from './AddShopModal';
import { AddShopUserModal } from './AddShopUserModal';
import { Dealer, Shop } from './types';

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
		borderRadius: theme.radius.md,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		transition: 'all 0.2s ease',
		cursor: 'pointer',

		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: theme.shadows.md,
			borderColor: theme.colors.yellow[3],
		},
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

	statusBadge: {
		fontWeight: 600,
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

	approvalButtons: {
		display: 'flex',
		gap: theme.spacing.xs,
	},
}));

export function ShopList() {
	const { classes } = useStyles();
	const request = useRequest(true);
	const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [regionFilter, setRegionFilter] = useState<string>('all');

	// Modal states
	const [addShopModalOpened, { open: openAddShopModal, close: closeAddShopModal }] =
		useDisclosure(false);
	const [addUserModalOpened, { open: openAddUserModal, close: closeAddUserModal }] =
		useDisclosure(false);

	const { data: shopsData, isLoading } = useQuery({
		queryKey: ['shops'],
		queryFn: () => request.get('/shops'),
	});

	const approvalMutation = useMutation({
		mutationFn: ({ shopId, status }: { shopId: string; status: 'approved' | 'rejected' }) =>
			request.post(`/shops/${shopId}/approval?status=${status}`),
	});

	const handleAddShopAgent = (shop: Shop) => {
		setSelectedShop(shop);
		openAddUserModal();
	};

	// Filter and search logic
	const filteredShops = useMemo(() => {
		if (!shopsData?.data?.data) return [];

		return shopsData.data.data.filter((shop: Shop) => {
			const matchesSearch =
				shop.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				shop.dealerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				shop.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				shop.region?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = statusFilter === 'all' || shop.status === statusFilter;
			const matchesRegion = regionFilter === 'all' || shop.region === regionFilter;

			return matchesSearch && matchesStatus && matchesRegion;
		});
	}, [shopsData?.data?.data, searchTerm, statusFilter, regionFilter]);

	// Get unique regions for filter
	const uniqueRegions = useMemo(() => {
		if (!shopsData?.data?.data) return [];
		const regions = [...new Set(shopsData.data.data.map((shop: Shop) => shop.region))];
		return regions.filter((region): region is string => Boolean(region));
	}, [shopsData?.data?.data]);

	const getStatusColor = (status: string) => {
		return status === 'active' ? 'yellow' : 'red';
	};

	const getStatusIcon = (status: string) => {
		return status === 'active' ? <IconCheck size={14} /> : <IconX size={14} />;
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
							Shops
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Manage shop locations and their status across the network
						</Text>
					</div>
					<Button
						leftIcon={<IconPlus size={16} />}
						onClick={openAddShopModal}
						size="md"
						radius="md"
					>
						Add New Shop
					</Button>
				</Group>
			</div>

			{/* Search and Filter Section */}
			<div className={classes.searchSection}>
				<div className={classes.searchRow}>
					<TextInput
						placeholder="Search shops..."
						icon={<IconSearch size={16} />}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.currentTarget.value)}
						style={{ flex: 1, minWidth: 250 }}
					/>
					<Select
						placeholder="Filter by status"
						data={[
							{ value: 'all', label: 'All Status' },
							{ value: 'active', label: 'Active' },
							{ value: 'inactive', label: 'Inactive' },
						]}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
					<Select
						placeholder="Filter by region"
						data={[
							{ value: 'all', label: 'All Regions' },
							...uniqueRegions.map((region: string) => ({
								value: region,
								label: region,
							})),
						]}
						value={regionFilter}
						onChange={(value) => setRegionFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
				</div>
			</div>

			{/* Enhanced Card Grid */}
			{isLoading ? (
				<Text
					align="center"
					py="xl"
				>
					Loading shops...
				</Text>
			) : filteredShops.length === 0 ? (
				<div className={classes.emptyState}>
					<IconBuildingStore
						size={48}
						color="gray"
					/>
					<Text
						size="lg"
						mt="md"
					>
						No shops found
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
					{filteredShops.map((shop: Shop) => (
						<Grid.Col
							key={shop.shopName}
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
												color={getStatusColor(shop.status)}
											>
												<IconBuildingStore size={16} />
											</ThemeIcon>
											<Text
												weight={600}
												size="sm"
												lineClamp={1}
											>
												{shop.shopName?.toUpperCase()}
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
													icon={<IconUserPlus size={16} />}
													onClick={() => handleAddShopAgent(shop)}
												>
													Add Shop Agent
												</Menu.Item>
												{shop.status === 'inactive' && (
													<>
														<Menu.Divider />
														<Menu.Item
															icon={<IconCheck size={16} />}
															color="yellow"
															onClick={() =>
																approvalMutation.mutate({
																	shopId: shop.shopName,
																	status: 'approved',
																})
															}
														>
															Approve
														</Menu.Item>
														<Menu.Item
															icon={<IconX size={16} />}
															color="red"
															onClick={() =>
																approvalMutation.mutate({
																	shopId: shop.shopName,
																	status: 'rejected',
																})
															}
														>
															Reject
														</Menu.Item>
													</>
												)}
											</Menu.Dropdown>
										</Menu>
									</Group>
								</Card.Section>

								<Card.Section className={classes.cardBody}>
									<Stack spacing="xs">
										<div className={classes.infoRow}>
											<IconMapPin
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
												lineClamp={1}
											>
												{shop.location?.toUpperCase()}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconGlobe
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{shop.region?.toUpperCase()}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconUser
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
												lineClamp={1}
											>
												{shop.dealerName?.toUpperCase()}
											</Text>
										</div>
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group position="apart">
										<Badge
											color={getStatusColor(shop.status)}
											variant="filled"
											size="sm"
											className={classes.statusBadge}
											leftSection={getStatusIcon(shop.status)}
										>
											{shop.status?.toUpperCase()}
										</Badge>

										{shop.status === 'inactive' && (
											<div className={classes.approvalButtons}>
												<Tooltip label="Approve">
													<ActionIcon
														color="yellow"
														variant="light"
														size="sm"
														onClick={() =>
															approvalMutation.mutate({
																shopId: shop.shopName,
																status: 'approved',
															})
														}
														loading={approvalMutation.isLoading}
													>
														<IconCheck size={14} />
													</ActionIcon>
												</Tooltip>
												<Tooltip label="Reject">
													<ActionIcon
														color="red"
														variant="light"
														size="sm"
														onClick={() =>
															approvalMutation.mutate({
																shopId: shop.shopName,
																status: 'rejected',
															})
														}
														loading={approvalMutation.isLoading}
													>
														<IconX size={14} />
													</ActionIcon>
												</Tooltip>
											</div>
										)}
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			)}

			{/* Modals */}
			<AddShopModal
				opened={addShopModalOpened}
				onClose={closeAddShopModal}
				dealer={
					{
						id: '',
						name: '',
						contactPerson: '',
						email: '',
						phone: '',
						category: 'wakanet',
						createdAt: '',
						status: 'active',
					} as Dealer
				}
			/>

			{selectedShop && (
				<AddShopUserModal
					opened={addUserModalOpened}
					onClose={closeAddUserModal}
					dealer={
						{
							id: selectedShop.dealerName,
							name: selectedShop.dealerName,
							contactPerson: '',
							email: '',
							phone: '',
							category: 'wakanet',
							createdAt: '',
							status: 'active',
						} as Dealer
					}
					shops={[
						{
							id: selectedShop.shopName,
							name: selectedShop.shopName,
						},
					]}
				/>
			)}
		</div>
	);
}
