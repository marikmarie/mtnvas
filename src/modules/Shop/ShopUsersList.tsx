import {
	ActionIcon,
	Alert,
	Badge,
	Button,
	Card,
	createStyles,
	Grid,
	Group,
	Menu,
	Modal,
	Select,
	Skeleton,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconCheck,
	IconDotsVertical,
	IconFilter,
	IconMail,
	IconPhone,
	IconPlus,
	IconPower,
	IconSearch,
	IconShield,
	IconTrash,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Dealer, Shop, ShopUser } from '../Dealer/types';
import { AddShopUserModal } from './AddShopUserModal';

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

	confirmModalHeader: {
		padding: theme.spacing.lg,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	confirmModalContent: {
		padding: theme.spacing.lg,
	},

	confirmModalActions: {
		padding: theme.spacing.lg,
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},
}));

export function ShopUsersList({ shop }: ShopUsersListProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();
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

	const { data: users, isLoading } = useQuery({
		queryFn: () =>
			request.get(`/agents`, {
				params: {
					shopId: shop?.id,
					dealerId: shop?.dealerId,
				},
			}),
		queryKey: ['shop-users', shop?.id, shop?.dealerId],
		enabled: !!shop?.id,
	});

	const activateMutation = useMutation({
		mutationFn: (userId: string) => request.post(`/agents/${userId}/activate`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shop-users'] });
		},
	});

	const deactivateMutation = useMutation({
		mutationFn: (userId: string) => request.post(`/agents/${userId}/deactivate`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shop-users'] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (userId: string) => request.delete(`/agents/${userId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shop-users'] });
		},
	});

	const handleAction = (user: ShopUser, action: 'activate' | 'deactivate' | 'delete') => {
		setSelectedUser(user);
		setConfirmAction(action);
		openConfirmModal();
	};

	const executeAction = () => {
		if (!selectedUser) return;

		switch (confirmAction) {
			case 'activate':
				activateMutation.mutate(selectedUser.id);
				break;
			case 'deactivate':
				deactivateMutation.mutate(selectedUser.id);
				break;
			case 'delete':
				deleteMutation.mutate(selectedUser.id);
				break;
		}
		closeConfirmModal();
	};

	const filteredUsers = useMemo(() => {
		if (!users?.data?.data) return [];

		return users.data.data.filter((user: ShopUser) => {
			const matchesSearch =
				user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.msisdn?.includes(searchTerm) ||
				user.shopName?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
			const matchesRole = roleFilter === 'all' || user.userType === roleFilter;

			return matchesSearch && matchesStatus && matchesRole;
		});
	}, [users?.data?.data, searchTerm, statusFilter, roleFilter]);

	const getStatusColor = (status: string) => {
		return status.toLowerCase() === 'active' ? 'green' : 'red';
	};

	const getStatusIcon = (status: string) => {
		return status.toLowerCase() === 'active' ? <IconCheck size={14} /> : <IconX size={14} />;
	};

	const getRoleColor = (role: string) => {
		switch (role?.toLowerCase()) {
			case 'dsa':
				return 'yellow';
			case 'retailer':
				return 'green';
			case 'shop_agent':
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
			case 'shop_agent':
				return <IconUser size={14} />;
			default:
				return <IconUser size={14} />;
		}
	};

	const getActionTitle = () => {
		switch (confirmAction) {
			case 'activate':
				return 'Activate User';
			case 'deactivate':
				return 'Deactivate User';
			case 'delete':
				return 'Delete User';
			default:
				return 'Confirm Action';
		}
	};

	const getActionDescription = () => {
		if (!selectedUser) return '';

		switch (confirmAction) {
			case 'activate':
				return `Are you sure you want to activate "${selectedUser.name}"? This will enable the user to access the system.`;
			case 'deactivate':
				return `Are you sure you want to deactivate "${selectedUser.name}"? This will temporarily disable the user's access.`;
			case 'delete':
				return `Are you sure you want to permanently delete "${selectedUser.name}"? This action cannot be undone.`;
			default:
				return `Are you sure you want to ${confirmAction} the user "${selectedUser.name}"?`;
		}
	};

	const getActionColor = () => {
		switch (confirmAction) {
			case 'activate':
				return 'green';
			case 'deactivate':
				return 'orange';
			case 'delete':
				return 'red';
			default:
				return 'yellow';
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
							{ value: 'dsa', label: 'DSA' },
							{ value: 'retailer', label: 'Retailer' },
							{ value: 'shop_agent', label: 'Shop Agent' },
						]}
						value={roleFilter}
						onChange={(value) => setRoleFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
				</div>
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
														user.status.toLowerCase() === 'active'
															? 'red'
															: 'green'
													}
													onClick={() =>
														handleAction(
															user,
															user.status.toLowerCase() === 'active'
																? 'deactivate'
																: 'activate'
														)
													}
												>
													{user.status.toLowerCase() === 'active'
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
										{user.shopName && (
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
										)}
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
											{user.userType?.replace('_', ' ')}
										</Badge>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			)}

			<AddShopUserModal
				opened={addModalOpened}
				onClose={closeAddModal}
				dealer={
					{
						id: shop?.dealerId!,
						dealerName: shop?.dealerName!,
						email: '',
						department: '',
						msisdn: '',
						category: 'EBU',
						createdAt: '',
						status: 'Active',
						region: '',
						location: '',
						updatedBy: '',
						updatedAt: '',
						isActive: true,
					} as Dealer
				}
				shops={[
					{
						id: shop?.id!,
						name: shop?.shopName!,
					},
				]}
			/>

			<Modal
				opened={confirmModalOpened}
				onClose={closeConfirmModal}
				size="md"
			>
				<div className={classes.confirmModalHeader}>
					<Group spacing="md">
						<ThemeIcon
							size={40}
							radius="md"
							variant="light"
							color={getActionColor()}
						>
							<IconAlertTriangle size={20} />
						</ThemeIcon>
						<div>
							<Title
								order={3}
								size="h4"
							>
								{getActionTitle()}
							</Title>
							<Text
								color="dimmed"
								size="sm"
							>
								Confirm your action
							</Text>
						</div>
					</Group>
				</div>

				<div className={classes.confirmModalContent}>
					<Text
						align="center"
						mb="lg"
					>
						{getActionDescription()}
					</Text>
					{confirmAction === 'delete' && (
						<Alert
							icon={<IconAlertTriangle size={16} />}
							title="Warning"
							color="red"
							variant="light"
						>
							This action is permanent and cannot be undone. All associated data will
							be lost.
						</Alert>
					)}
				</div>

				<div className={classes.confirmModalActions}>
					<Group
						position="right"
						spacing="md"
					>
						<Button
							variant="subtle"
							onClick={closeConfirmModal}
							radius="md"
						>
							Cancel
						</Button>
						<Button
							color={getActionColor()}
							onClick={executeAction}
							loading={
								activateMutation.isLoading ||
								deactivateMutation.isLoading ||
								deleteMutation.isLoading
							}
							radius="md"
						>
							{confirmAction === 'activate'
								? 'Activate'
								: confirmAction === 'deactivate'
									? 'Deactivate'
									: 'Delete'}
						</Button>
					</Group>
				</div>
			</Modal>
		</div>
	);
}
