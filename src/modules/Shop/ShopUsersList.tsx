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
	Alert,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconPower,
	IconTrash,
	IconSearch,
	IconFilter,
	IconPlus,
	IconDotsVertical,
	IconUser,
	IconMail,
	IconPhone,
	IconShield,
	IconCheck,
	IconX,
	IconAlertCircle,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import useRequest from '../../hooks/useRequest';
import { AddShopUserModal } from './AddShopUserModal';
import { ConfirmationModal } from '../Dealer/ConfirmationModal';
import { Dealer, Shop, ShopUser } from '../Dealer/types';

interface ShopUsersListProps {
	shop: Shop | undefined;
}

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

	roleBadge: {
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

	noShopAlert: {
		marginBottom: theme.spacing.lg,
	},
}));

export function ShopUsersList({ shop }: ShopUsersListProps) {
	const { classes } = useStyles();
	const [selectedUser, setSelectedUser] = useState<ShopUser | null>(null);
	const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | 'delete'>(
		'activate'
	);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [roleFilter, setRoleFilter] = useState<string>('all');

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] =
		useDisclosure(false);

	const request = useRequest(true);

	const { data: users, isLoading } = useQuery({
		queryFn: () => request.get(`/shops/${shop?.shopName}/users`),
		queryKey: ['shop-users', shop?.shopName],
		enabled: !!shop?.shopName,
	});

	const handleAction = (user: ShopUser, action: 'activate' | 'deactivate' | 'delete') => {
		setSelectedUser(user);
		setConfirmAction(action);
		openConfirmModal();
	};

	// Filter and search logic
	const filteredUsers = useMemo(() => {
		if (!users?.data) return [];

		return users.data.filter((user: ShopUser) => {
			const matchesSearch =
				user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.msisdn?.includes(searchTerm) ||
				user.shopName?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
			const matchesRole = roleFilter === 'all' || user.userType === roleFilter;

			return matchesSearch && matchesStatus && matchesRole;
		});
	}, [users?.data, searchTerm, statusFilter, roleFilter]);

	const getStatusColor = (status: string) => {
		return status === 'active' ? 'yellow' : 'red';
	};

	const getStatusIcon = (status: string) => {
		return status === 'active' ? <IconCheck size={14} /> : <IconX size={14} />;
	};

	const getRoleColor = (role: string) => {
		switch (role?.toLowerCase()) {
			case 'dsa':
				return 'yellow';
			case 'retailer':
				return 'green';
			case 'shopagent':
				return 'orange';
			default:
				return 'gray';
		}
	};

	const getRoleIcon = (role: string) => {
		switch (role?.toLowerCase()) {
			case 'dsa':
				return <IconShield size={14} />;
			case 'retailer':
				return <IconUser size={14} />;
			case 'shopagent':
				return <IconUser size={14} />;
			default:
				return <IconUser size={14} />;
		}
	};

	if (!shop) {
		return (
			<Alert
				icon={<IconAlertCircle size={16} />}
				title="No Shop Selected"
				color="yellow"
				className={classes.noShopAlert}
			>
				Please select a shop from the Shops tab to view and manage its users.
			</Alert>
		);
	}

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
							Shop Users
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Manage users for shop: <strong>{shop.shopName}</strong>
						</Text>
					</div>
					<Button
						leftIcon={<IconPlus size={16} />}
						onClick={openAddModal}
						size="md"
						radius="md"
					>
						Add User
					</Button>
				</Group>
			</div>

			{/* Search and Filter Section */}
			<div className={classes.searchSection}>
				<div className={classes.searchRow}>
					<TextInput
						placeholder="Search users..."
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
						placeholder="Filter by role"
						data={[
							{ value: 'all', label: 'All Roles' },
							{ value: 'DSA', label: 'DSA' },
							{ value: 'Retailer', label: 'Retailer' },
							{ value: 'ShopAgent', label: 'Shop Agent' },
						]}
						value={roleFilter}
						onChange={(value) => setRoleFilter(value || 'all')}
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
					Loading users...
				</Text>
			) : filteredUsers.length === 0 ? (
				<div className={classes.emptyState}>
					<IconUser
						size={48}
						color="gray"
					/>
					<Text
						size="lg"
						mt="md"
					>
						No users found
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
					{filteredUsers.map((user: ShopUser) => (
						<Grid.Col
							key={user.id}
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
												color={getStatusColor(user.status)}
											>
												<IconUser size={16} />
											</ThemeIcon>
											<Text
												weight={600}
												size="sm"
												lineClamp={1}
											>
												{user.name}
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
													icon={<IconPower size={16} />}
													color={
														user.status === 'active' ? 'red' : 'yellow'
													}
													onClick={() =>
														handleAction(
															user,
															user.status === 'active'
																? 'deactivate'
																: 'activate'
														)
													}
												>
													{user.status === 'active'
														? 'Deactivate'
														: 'Activate'}
												</Menu.Item>
												<Menu.Item
													icon={<IconTrash size={16} />}
													color="red"
													onClick={() => handleAction(user, 'delete')}
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
											<IconMail
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
												lineClamp={1}
											>
												{user.email}
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
												{user.msisdn}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconShield
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{user.shopName}
											</Text>
										</div>
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group position="apart">
										<Badge
											color={getStatusColor(user.status)}
											variant="filled"
											size="sm"
											className={classes.statusBadge}
											leftSection={getStatusIcon(user.status)}
										>
											{user.status?.charAt(0)?.toUpperCase() +
												user.status?.slice(1)}
										</Badge>
										<Badge
											color={getRoleColor(user.userType)}
											variant="light"
											size="sm"
											className={classes.roleBadge}
											leftSection={getRoleIcon(user.userType)}
										>
											{user.userType}
										</Badge>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			)}

			{/* Modals */}
			<AddShopUserModal
				opened={addModalOpened}
				onClose={closeAddModal}
				dealer={
					{
						id: shop?.dealerName!,
						name: shop?.dealerName!,
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
						id: shop?.shopName!,
						name: shop?.shopName!,
					},
				]}
			/>

			{selectedUser && (
				<ConfirmationModal
					opened={confirmModalOpened}
					onClose={closeConfirmModal}
					action={confirmAction}
					dealer={
						{
							id: shop?.dealerName!,
							name: shop?.dealerName!,
							contactPerson: '',
							email: '',
							phone: '',
							category: 'wakanet',
							createdAt: '',
							status: 'active',
						} as Dealer
					}
				/>
			)}
		</div>
	);
}
