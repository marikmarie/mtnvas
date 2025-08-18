import {
	ActionIcon,
	Badge,
	Button,
	Card,
	createStyles,
	Grid,
	Group,
	Menu,
	Select,
	Skeleton,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconBuildingStore,
	IconCheck,
	IconDotsVertical,
	IconEdit,
	IconFilter,
	IconGlobe,
	IconMapPin,
	IconPlus,
	IconSearch,
	IconUser,
	IconUserPlus,
	IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Dealer, Shop } from '../Dealer/types';
import { AddShopModal } from './AddShopModal';
import { AddShopUserModal } from './AddShopUserModal';
import { AssignShopAdminModal } from './AssignShopAdminModal';
import { EditShopModal } from './EditShopModal';
import { ShopApprovalModal } from './ShopApprovalModal';

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

	pendingApprovalBadge: {
		backgroundColor: theme.colors.orange[6],
		color: theme.white,
	},
}));

export function ShopList() {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();
	const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [regionFilter, setRegionFilter] = useState<string>('all');
	const [dealerFilter, setDealerFilter] = useState<string>('all');
	const [currentPage] = useState(1);
	const [pageSize] = useState(10);

	// Modal states
	const [addShopModalOpened, { open: openAddShopModal, close: closeAddShopModal }] =
		useDisclosure(false);
	const [addUserModalOpened, { open: openAddUserModal, close: closeAddUserModal }] =
		useDisclosure(false);
	const [editShopModalOpened, { open: openEditShopModal, close: closeEditShopModal }] =
		useDisclosure(false);
	const [assignAdminModalOpened, { open: openAssignAdminModal, close: closeAssignAdminModal }] =
		useDisclosure(false);
	const [approvalModalOpened, { open: openApprovalModal, close: closeApprovalModal }] =
		useDisclosure(false);
	const [approvalAction, setApprovalAction] = useState<'Approve' | 'Reject'>('Approve');

	// Fetch shops with proper query parameters
	const { data: shopsData, isLoading } = useQuery({
		queryKey: [
			'shops',
			currentPage,
			pageSize,
			searchTerm,
			statusFilter,
			regionFilter,
			dealerFilter,
		],
		queryFn: () =>
			request.get('/shops', {
				params: {
					page: currentPage,
					limit: pageSize,
					search: searchTerm || undefined,
					status: statusFilter === 'all' ? undefined : statusFilter,
					region: regionFilter === 'all' ? undefined : regionFilter,
					dealerId: dealerFilter === 'all' ? undefined : dealerFilter,
				},
			}),
	});

	// Fetch pending approvals
	const { data: pendingApprovals } = useQuery({
		queryKey: ['shops', 'pending-approvals'],
		queryFn: () => request.get('/shops/pending-approvals'),
	});

	// Fetch dealers for filter
	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/dealer'),
	});

	const approvalMutation = useMutation({
		mutationFn: ({
			shopId,
			action,
			reason,
			assignToAdminId,
		}: {
			shopId: string;
			action: 'Approve' | 'Reject';
			reason?: string;
			assignToAdminId?: string;
		}) =>
			request.post(`/shops/${shopId}/approval`, {
				action,
				reason,
				assignToAdminId,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shops'] });
			queryClient.invalidateQueries({ queryKey: ['shops', 'pending-approvals'] });
			closeApprovalModal();
		},
	});

	const handleAddShopAgent = (shop: Shop) => {
		setSelectedShop(shop);
		openAddUserModal();
	};

	const handleEditShop = (shop: Shop) => {
		setSelectedShop(shop);
		openEditShopModal();
	};

	const handleAssignAdmin = (shop: Shop) => {
		setSelectedShop(shop);
		openAssignAdminModal();
	};

	const handleApproval = (shop: Shop, action: 'Approve' | 'Reject') => {
		setSelectedShop(shop);
		setApprovalAction(action);
		openApprovalModal();
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

			const matchesStatus =
				statusFilter === 'all' || shop.status.toLowerCase() === statusFilter.toLowerCase();
			const matchesRegion = regionFilter === 'all' || shop.region === regionFilter;
			const matchesDealer = dealerFilter === 'all' || shop.dealerId === dealerFilter;

			return matchesSearch && matchesStatus && matchesRegion && matchesDealer;
		});
	}, [shopsData?.data?.data, searchTerm, statusFilter, regionFilter, dealerFilter]);

	// Get unique regions and dealers for filters
	const uniqueRegions = useMemo(() => {
		if (!shopsData?.data?.data) return [];
		const regions = [...new Set(shopsData.data.data.map((shop: Shop) => shop.region))];
		return regions.filter((region): region is string => Boolean(region));
	}, [shopsData?.data?.data]);

	const dealerOptions = useMemo(() => {
		if (!dealersData?.data?.data) return [];
		return dealersData.data.data.map((dealer: Dealer) => ({
			value: dealer.id,
			label: dealer.dealerName,
		}));
	}, [dealersData?.data?.data]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Active':
				return 'green';
			case 'Inactive':
				return 'red';
			case 'Pending Approval':
				return 'orange';
			default:
				return 'gray';
		}
	};

	const pendingApprovalsCount = pendingApprovals?.data?.length || 0;

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
							{pendingApprovalsCount > 0 && (
								<Badge
									color="orange"
									variant="filled"
									ml="sm"
									className={classes.pendingApprovalBadge}
								>
									{pendingApprovalsCount} Pending Approval
								</Badge>
							)}
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
							{ value: 'Active', label: 'Active' },
							{ value: 'Inactive', label: 'Inactive' },
							{ value: 'PendingApproval', label: 'Pending Approval' },
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
					<Select
						placeholder="Filter by dealer"
						data={[{ value: 'all', label: 'All Dealers' }, ...dealerOptions]}
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
												width={160}
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
											width="50%"
										/>
										<Skeleton
											height={12}
											width="40%"
										/>
										<Skeleton
											height={12}
											width="70%"
										/>
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group position="apart">
										<Skeleton
											height={24}
											width={100}
											radius="xl"
										/>
										<Skeleton
											height={24}
											width={60}
											radius="md"
										/>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
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
							key={shop.id}
							xs={12}
							sm={6}
							lg={3}
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
												<Menu.Item
													icon={<IconEdit size={16} />}
													onClick={() => handleEditShop(shop)}
												>
													Edit Shop
												</Menu.Item>
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
												{shop.dealerName?.toUpperCase() || 'N/A'}
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
										>
											{shop.status?.toUpperCase()}
										</Badge>

										{shop.status.toLowerCase() === 'PendingApproval' && (
											<div className={classes.approvalButtons}>
												<Tooltip label="Approve">
													<ActionIcon
														color="green"
														variant="light"
														size="sm"
														onClick={() =>
															handleApproval(shop, 'Approve')
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
															handleApproval(shop, 'Reject')
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

			<AddShopModal
				opened={addShopModalOpened}
				onClose={closeAddShopModal}
			/>

			{selectedShop && (
				<>
					<AddShopUserModal
						opened={addUserModalOpened}
						onClose={closeAddUserModal}
						dealer={
							{
								id: selectedShop.dealerId,
								dealerName: selectedShop.dealerName,
								contactPerson: '',
								email: '',
								phone: '',
								category: 'wakanet',
								department: '',
								msisdn: '',
								createdAt: '',
								status: 'Active',
								updatedAt: '',
								isActive: true,
							} as Dealer
						}
						shops={[
							{
								id: selectedShop.id,
								name: selectedShop.shopName,
							},
						]}
					/>

					<EditShopModal
						opened={editShopModalOpened}
						onClose={closeEditShopModal}
						shop={selectedShop}
					/>

					<AssignShopAdminModal
						opened={assignAdminModalOpened}
						onClose={closeAssignAdminModal}
						shop={selectedShop}
					/>

					<ShopApprovalModal
						opened={approvalModalOpened}
						onClose={closeApprovalModal}
						shop={selectedShop}
						action={approvalAction}
					/>
				</>
			)}
		</div>
	);
}
