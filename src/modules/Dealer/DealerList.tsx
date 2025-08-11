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
	createStyles,
	Grid,
	ThemeIcon,
	Menu,
	Title,
	Skeleton,
	Pagination,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconEdit,
	IconEye,
	IconPower,
	IconTrash,
	IconUserPlus,
	IconSearch,
	IconFilter,
	IconPlus,
	IconDotsVertical,
	IconBuilding,
	IconMail,
	IconPhone,
	IconUser,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import useRequest from '../../hooks/useRequest';
import { AddDealerModal } from './AddDealerModal';
import { AddDealerUserModal } from './AddDealerUserModal';
import { ConfirmationModal } from './ConfirmationModal';
import { EditDealerModal } from './EditDealerModal';
import { Dealer } from './types';
import { ViewDealerModal } from './ViewDealerModal';
import { AddDealerAdminModal } from './AddDealerAdminModal';

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
}));

export function DealerList() {
	const { classes } = useStyles();
	const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
	const [addUserType, setAddUserType] = useState<'DSA' | 'Retailer' | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
	const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
	const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] =
		useDisclosure(false);
	const [addAdminOpened, { open: openAddAdmin, close: closeAddAdmin }] = useDisclosure(false);
	const [page, setPage] = useState(1);
	const [limit] = useState(12);
	const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | 'delete'>(
		'activate'
	);

	const handleAction = (
		dealer: Dealer,
		action: 'edit' | 'view' | 'activate' | 'deactivate' | 'delete'
	) => {
		setSelectedDealer(dealer);
		switch (action) {
			case 'edit':
				openEditModal();
				break;
			case 'view':
				openViewModal();
				break;
			case 'activate':
			case 'deactivate':
			case 'delete':
				setConfirmAction(action);
				openConfirmModal();
				break;
		}
	};

	const request = useRequest(true);

	const { data: dealers, isLoading } = useQuery({
		queryFn: () =>
			request.get('/dealer-groups', {
				params: {
					search: searchTerm || undefined,
					department: categoryFilter !== 'all' ? categoryFilter : undefined,
					status: statusFilter !== 'all' ? statusFilter : undefined,
					page,
					limit,
				},
			}),
		queryKey: ['dealers', { searchTerm, categoryFilter, statusFilter, page, limit }],
	});

	const handleAddUser = (dealer: Dealer, userType: 'DSA' | 'Retailer') => {
		setSelectedDealer(dealer);
		setAddUserType(userType);
	};

	// Filter and search logic
	const filteredDealers = useMemo(() => {
		return dealers?.data?.data || [];
	}, [dealers?.data?.data]);

	const getStatusColor = (status: string) => {
		return status === 'active' ? 'yellow' : 'red';
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
							Dealers
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Manage your dealer network and partnerships
						</Text>
					</div>
					<Button
						leftIcon={<IconPlus size={16} />}
						onClick={openAddModal}
						size="md"
						radius="md"
					>
						Add New Dealer
					</Button>
				</Group>
			</div>

			{/* Search and Filter Section */}
			<div className={classes.searchSection}>
				<div className={classes.searchRow}>
					<TextInput
						placeholder="Search dealers..."
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
							lg={12}
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
											width="60%"
										/>
										<Skeleton
											height={12}
											width="80%"
										/>
										<Skeleton
											height={12}
											width="40%"
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
											width={100}
											radius="xl"
										/>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			) : filteredDealers.length === 0 ? (
				<div className={classes.emptyState}>
					<IconBuilding
						size={48}
						color="gray"
					/>
					<Text
						size="lg"
						mt="md"
					>
						No dealers found
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
					{filteredDealers.map((dealer: Dealer) => (
						<Grid.Col
							key={dealer.id}
							xs={12}
							sm={6}
							lg={12}
						>
							<Card
								className={classes.card}
								onClick={() => handleAction(dealer, 'view')}
							>
								<Card.Section className={classes.cardHeader}>
									<Group position="apart">
										<Group spacing="xs">
											<ThemeIcon
												size="md"
												radius="md"
												variant="light"
												color={getCategoryColor(dealer.department)}
											>
												<IconBuilding size={16} />
											</ThemeIcon>
											<Text
												weight={600}
												size="sm"
												lineClamp={1}
											>
												{dealer.companyName}
											</Text>
										</Group>
										<Menu>
											<Menu.Target>
												<ActionIcon
													variant="subtle"
													size="sm"
													onClick={(e) => e.stopPropagation()}
												>
													<IconDotsVertical size={16} />
												</ActionIcon>
											</Menu.Target>
											<Menu.Dropdown>
												<Menu.Item
													icon={<IconEye size={16} />}
													onClick={(e) => {
														e.stopPropagation();
														handleAction(dealer, 'view');
													}}
												>
													View Details
												</Menu.Item>
												<Menu.Item
													icon={<IconUserPlus size={16} />}
													onClick={(e) => {
														e.stopPropagation();
														setSelectedDealer(dealer);
														openAddAdmin();
													}}
												>
													Add Dealer Admin
												</Menu.Item>
												<Menu.Item
													icon={<IconEdit size={16} />}
													onClick={(e) => {
														e.stopPropagation();
														handleAction(dealer, 'edit');
													}}
												>
													Edit
												</Menu.Item>
												<Menu.Divider />
												<Menu.Item
													icon={<IconUserPlus size={16} />}
													onClick={(e) => {
														e.stopPropagation();
														handleAddUser(dealer, 'DSA');
													}}
												>
													Add DSA
												</Menu.Item>
												<Menu.Item
													icon={<IconUserPlus size={16} />}
													onClick={(e) => {
														e.stopPropagation();
														handleAddUser(dealer, 'Retailer');
													}}
												>
													Add Retailer
												</Menu.Item>
												<Menu.Divider />
												<Menu.Item
													icon={<IconPower size={16} />}
													color={
														dealer.status === 'active'
															? 'red'
															: 'yellow'
													}
													onClick={(e) => {
														e.stopPropagation();
														handleAction(
															dealer,
															dealer.status === 'active'
																? 'deactivate'
																: 'activate'
														);
													}}
												>
													{dealer.status === 'active'
														? 'Deactivate'
														: 'Activate'}
												</Menu.Item>
												<Menu.Item
													icon={<IconTrash size={16} />}
													color="red"
													onClick={(e) => {
														e.stopPropagation();
														handleAction(dealer, 'delete');
													}}
												>
													Delete
												</Menu.Item>
											</Menu.Dropdown>
										</Menu>
									</Group>
								</Card.Section>

								<Card.Section className={classes.cardBody}>
									<Stack spacing="xs">
										<div className={classes.infoRow}>
											<IconUser
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{dealer.contactPerson}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconMail
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
												lineClamp={1}
											>
												{dealer.email}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconPhone
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{dealer.msisdn}
											</Text>
										</div>
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group position="apart">
										<Badge
											color={getStatusColor(dealer.status)}
											variant="filled"
											size="sm"
											className={classes.statusBadge}
										>
											{dealer.status?.charAt(0)?.toUpperCase() +
												dealer.status?.slice(1)}
										</Badge>
										<Badge
											color={getCategoryColor(dealer.department)}
											variant="light"
											size="sm"
										>
											{dealer.department?.charAt(0)?.toUpperCase() +
												dealer.department?.slice(1)}
										</Badge>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			)}

			{/* Pagination */}
			{dealers?.data?.meta?.total ? (
				<Group
					position="right"
					mt="md"
				>
					<Pagination
						value={page}
						onChange={setPage}
						total={Math.max(
							1,
							Math.ceil(
								(dealers.data.meta.total || 0) / (dealers.data.meta.limit || limit)
							)
						)}
					/>
				</Group>
			) : null}

			{/* Modals */}
			<AddDealerModal
				opened={addModalOpened}
				onClose={closeAddModal}
			/>

			{selectedDealer && (
				<>
					<EditDealerModal
						opened={editModalOpened}
						onClose={closeEditModal}
						dealer={selectedDealer}
					/>

					<ViewDealerModal
						opened={viewModalOpened}
						onClose={closeViewModal}
						dealer={selectedDealer}
					/>

					<ConfirmationModal
						opened={confirmModalOpened}
						onClose={closeConfirmModal}
						action={confirmAction}
						dealer={selectedDealer}
					/>
					<AddDealerAdminModal
						opened={addAdminOpened}
						onClose={closeAddAdmin}
						dealerId={selectedDealer.id}
					/>
				</>
			)}

			{selectedDealer && addUserType && (
				<AddDealerUserModal
					opened={!!addUserType}
					onClose={() => setAddUserType(null)}
					dealer={selectedDealer}
					userType={addUserType}
				/>
			)}
		</div>
	);
}
