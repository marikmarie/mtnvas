import {
	ActionIcon,
	Badge,
	Button,
	Card,
	createStyles,
	Grid,
	Group,
	Menu,
	Modal,
	Pagination,
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
	IconCheck,
	IconClock,
	IconDotsVertical,
	IconEdit,
	IconId,
	IconMail,
	IconMapPin,
	IconPhone,
	IconSearch,
	IconShield,
	IconUser,
	IconUserPlus,
	IconX,
} from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Agent, AgentStatus, Dealer, Shop, UserType } from '../Dealer/types';
import { AddAgentCategoryModal } from './AddAgentCategoryModal';
import { AddAgentModal } from './AddAgentModal';
import { AgentApprovalModal } from './AgentApprovalModal';
import { AgentDuplicateCheckModal } from './AgentDuplicateCheckModal';
import { EditAgentModal } from './EditAgentModal';

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
	},

	userTypeBadge: {
		fontWeight: 600,
	},

	merchantCode: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		borderRadius: theme.radius.sm,
	},
}));

export function AgentList() {
	const { classes } = useStyles();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedDealer, setSelectedDealer] = useState<string | null>('');
	const [selectedShop, setSelectedShop] = useState<string | null>('');
	const [selectedUserType, setSelectedUserType] = useState<string | null>('');
	const [selectedStatus, setSelectedStatus] = useState<string | null>('');
	const [selectedRegion, setSelectedRegion] = useState<string | null>('');
	const [selectedLocation, setSelectedLocation] = useState<string | null>('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(12);
	const [dateRange] = useState<{ from: string | null; to: string | null }>({
		from: null,
		to: null,
	});

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
	const [approvalModalOpened, { open: openApprovalModal, close: closeApprovalModal }] =
		useDisclosure(false);
	const [
		duplicateCheckModalOpened,
		{ open: openDuplicateCheckModal, close: closeDuplicateCheckModal },
	] = useDisclosure(false);
	const [addCategoryModalOpened, { open: openAddCategoryModal, close: closeAddCategoryModal }] =
		useDisclosure(false);
	const [
		confirmationModalOpened,
		{ open: openConfirmationModal, close: closeConfirmationModal },
	] = useDisclosure(false);

	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

	const request = useRequest(true);
	const queryClient = useQueryClient();

	const agentsQueryParams = useMemo(() => {
		const params = new URLSearchParams();

		if (currentPage) params.append('page', currentPage.toString());
		if (itemsPerPage) params.append('pageSize', itemsPerPage.toString());
		if (dateRange.from) params.append('from', dateRange.from);
		if (dateRange.to) params.append('to', dateRange.to);
		if (selectedShop) params.append('shopName', selectedShop);
		if (selectedDealer) params.append('dealerName', selectedDealer);
		if (selectedRegion) params.append('region', selectedRegion);
		if (selectedLocation) params.append('location', selectedLocation);
		if (selectedStatus) params.append('status', selectedStatus);

		return params.toString();
	}, [
		currentPage,
		itemsPerPage,
		dateRange,
		selectedShop,
		selectedDealer,
		selectedRegion,
		selectedLocation,
		selectedStatus,
	]);

	const shopsQueryParams = useMemo(() => {
		const params = new URLSearchParams();

		if (selectedDealer) params.append('dealerId', selectedDealer);
		if (selectedRegion) params.append('region', selectedRegion);
		if (selectedLocation) params.append('location', selectedLocation);

		return params.toString();
	}, [selectedDealer, selectedRegion, selectedLocation]);

	const { data: agentsResponse, isLoading: agentsLoading } = useQuery({
		queryKey: ['agents', agentsQueryParams],
		queryFn: () => request.get(`/agents?${agentsQueryParams}`),
		keepPreviousData: true,
	});

	const { data: dealers, isLoading: dealersLoading } = useQuery({
		queryKey: ['dealer'],
		queryFn: () => request.get('/dealer'),
	});

	const { data: shopsResponse, isLoading: shopsLoading } = useQuery({
		queryKey: ['shops', shopsQueryParams],
		queryFn: () => request.get(`/shops?${shopsQueryParams}`),
		keepPreviousData: true,
	});

	const agents = agentsResponse?.data?.data || agentsResponse?.data || [];
	const shops = shopsResponse?.data?.data || shopsResponse?.data || [];
	const dealersData = dealers?.data?.data || dealers?.data || [];
	const totalAgents = agentsResponse?.data?.total || agentsResponse?.data?.length || 0;

	const regions = useMemo(() => {
		if (!shops || !Array.isArray(shops) || shopsLoading) return [];

		const uniqueRegions = new Set<string>();
		shops.forEach((shop: Shop) => {
			if (shop.region) uniqueRegions.add(shop.region);
		});
		return Array.from(uniqueRegions).map((region) => ({ value: region, label: region }));
	}, [shops, shopsLoading]);

	const locations = useMemo(() => {
		if (!shops || !Array.isArray(shops) || shopsLoading) return [];

		const uniqueLocations = new Set<string>();
		shops.forEach((shop: Shop) => {
			if (shop.location) uniqueLocations.add(shop.location);
		});
		return Array.from(uniqueLocations).map((location) => ({
			value: location,
			label: location,
		}));
	}, [shops, shopsLoading]);

	const userTypes = [
		{ value: 'ShopAgent', label: 'Shop Agent' },
		{ value: 'DSA', label: 'DSA' },
		{ value: 'Retailer', label: 'Retailer' },
	];

	const statuses = [
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
		{ value: 'PendingApproval', label: 'Pending Approval' },
	];

	const filteredAgents = useMemo(() => {
		if (!agents || !Array.isArray(agents) || agentsLoading) return [];

		return agents.filter((agent: Agent) => {
			const matchesSearch =
				agent.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				agent.msisdn?.includes(searchTerm) ||
				(agent.merchantCode &&
					agent.merchantCode.toLowerCase().includes(searchTerm.toLowerCase()));

			const matchesUserType = !selectedUserType || agent.userType === selectedUserType;

			return matchesSearch && matchesUserType;
		});
	}, [agents, searchTerm, selectedUserType, agentsLoading]);

	const totalPages = Math.ceil((totalAgents || 0) / itemsPerPage);

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedDealer, selectedShop, selectedRegion, selectedLocation, selectedStatus]);

	const handleAddAgent = () => {
		setSelectedAgent(null);
		openAddModal();
	};

	const handleEditAgent = (agent: Agent) => {
		if (!agent) return;
		setSelectedAgent(agent);
		openEditModal();
	};

	const handleApproval = (agent: Agent) => {
		if (!agent) return;
		setSelectedAgent(agent);
		openApprovalModal();
	};

	const handleDuplicateCheck = () => {
		setSelectedAgent(null);
		openDuplicateCheckModal();
	};

	const handleAddCategory = (agent: Agent) => {
		if (!agent) return;
		setSelectedAgent(agent);
		openAddCategoryModal();
	};

	const handleDeactivate = (agent: Agent) => {
		if (!agent) return;
		setSelectedAgent(agent);
		openConfirmationModal();
	};

	const handleConfirmDeactivate = async () => {
		if (!selectedAgent) return;

		try {
			await request.post(
				`/agents/${selectedAgent.id}/Approve?action=Reject&reason=Rejected by admin`
			);

			queryClient.invalidateQueries(['agents']);
			closeConfirmationModal();
			setSelectedAgent(null);
		} catch (error) {
			console.error('Error deactivating agent:', error);
		}
	};

	const handleCloseEditModal = () => {
		closeEditModal();
		setSelectedAgent(null);
	};

	const handleCloseApprovalModal = () => {
		closeApprovalModal();
		setSelectedAgent(null);
	};

	const handleCloseAddCategoryModal = () => {
		closeAddCategoryModal();
		setSelectedAgent(null);
	};

	const handleCloseConfirmationModal = () => {
		closeConfirmationModal();
		setSelectedAgent(null);
	};

	useEffect(() => {
		if (!selectedAgent) {
			closeEditModal();
			closeApprovalModal();
			closeAddCategoryModal();
			closeConfirmationModal();
		}
	}, [selectedAgent]);

	const getStatusColor = (status: AgentStatus) => {
		switch (status) {
			case 'Active':
				return 'green';
			case 'Inactive':
				return 'red';
			case 'PendingApproval':
				return 'yellow';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: AgentStatus) => {
		switch (status) {
			case 'Active':
				return <IconCheck size={16} />;
			case 'Inactive':
				return <IconX size={16} />;
			case 'PendingApproval':
				return <IconClock size={16} />;
			default:
				return <IconAlertCircle size={16} />;
		}
	};

	const getUserTypeColor = (userType: UserType) => {
		switch (userType) {
			case 'ShopAgent':
				return 'yellow';
			case 'DSA':
				return 'purple';
			case 'Retailer':
				return 'orange';
			default:
				return 'gray';
		}
	};

	const getUserTypeLabel = (userType: UserType) => {
		switch (userType) {
			case 'ShopAgent':
				return 'Shop Agent';
			case 'DSA':
				return 'DSA';
			case 'Retailer':
				return 'Retailer';
			default:
				return userType;
		}
	};

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<Group
					position="apart"
					align="center"
				>
					<div>
						<Title
							order={2}
							size="h3"
						>
							Agent Management
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Manage agents, DSAs, and retailers across your dealer network
						</Text>
					</div>
					<Group>
						<Button
							leftIcon={<IconUserPlus size={16} />}
							onClick={handleAddAgent}
							color="yellow"
						>
							Add Agent
						</Button>
						<Button
							variant="outline"
							leftIcon={<IconId size={16} />}
							onClick={handleDuplicateCheck}
						>
							Check Duplicates
						</Button>
					</Group>
				</Group>
			</div>

			<div className={classes.searchSection}>
				<div className={classes.searchRow}>
					<TextInput
						placeholder="Search agents..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						icon={<IconSearch size={16} />}
						style={{ flex: 1, minWidth: 200 }}
					/>
					<Select
						placeholder="Select Dealer"
						value={selectedDealer}
						onChange={setSelectedDealer}
						data={
							dealersData?.map((dealer: Dealer) => ({
								value: dealer.id,
								label: dealer.dealerName,
							})) || []
						}
						clearable
						style={{ minWidth: 150 }}
					/>
					<Select
						placeholder="Select Shop"
						value={selectedShop}
						onChange={setSelectedShop}
						data={
							shops?.map((shop: Shop) => ({
								value: shop.id,
								label: shop.shopName,
							})) || []
						}
						clearable
						style={{ minWidth: 150 }}
					/>
					<Select
						placeholder="Region"
						value={selectedRegion}
						onChange={setSelectedRegion}
						data={regions}
						clearable
						style={{ minWidth: 120 }}
					/>
					<Select
						placeholder="Location"
						value={selectedLocation}
						onChange={setSelectedLocation}
						data={locations}
						clearable
						style={{ minWidth: 120 }}
					/>
					<Select
						placeholder="User Type"
						value={selectedUserType}
						onChange={setSelectedUserType}
						data={userTypes}
						clearable
						style={{ minWidth: 120 }}
					/>
					<Select
						placeholder="Status"
						value={selectedStatus}
						onChange={setSelectedStatus}
						data={statuses}
						clearable
						style={{ minWidth: 120 }}
					/>
				</div>
			</div>

			<Grid gutter="md">
				{agentsLoading || dealersLoading || shopsLoading ? (
					<Grid>
						{Array.from({ length: 12 }).map((_, index) => (
							<Grid.Col
								key={index}
								xs={12}
								sm={6}
								md={4}
								lg={3}
							>
								<Skeleton height={200} />
							</Grid.Col>
						))}
					</Grid>
				) : filteredAgents && filteredAgents.length > 0 ? (
					filteredAgents.map((agent: Agent) => (
						<Grid.Col
							key={agent.id}
							xs={12}
							sm={6}
							md={4}
							lg={3}
						>
							<Card
								className={classes.card}
								shadow="sm"
							>
								<Card.Section className={classes.cardHeader}>
									<Group
										position="apart"
										align="flex-start"
									>
										<Group spacing="xs">
											<ThemeIcon
												size={40}
												radius="md"
												variant="light"
												color="yellow"
											>
												<IconUser size={20} />
											</ThemeIcon>
											<div>
												<Text
													weight={600}
													size="sm"
												>
													{agent.agentName}
												</Text>
												<Badge
													color={getUserTypeColor(agent.userType)}
													variant="light"
													size="xs"
													className={classes.userTypeBadge}
												>
													{getUserTypeLabel(agent.userType)}
												</Badge>
											</div>
										</Group>
										<Menu>
											<Menu.Target>
												<ActionIcon>
													<IconDotsVertical size={16} />
												</ActionIcon>
											</Menu.Target>
											<Menu.Dropdown>
												<Menu.Item
													icon={<IconEdit size={16} />}
													onClick={() => handleEditAgent(agent)}
												>
													Edit
												</Menu.Item>
												{agent.status === 'PendingApproval' ||
													(agent.status === 'Inactive' && (
														<Menu.Item
															icon={<IconShield size={16} />}
															color="green"
															onClick={() => handleApproval(agent)}
														>
															Approve
														</Menu.Item>
													))}

												<Menu.Item
													icon={<IconShield size={16} />}
													onClick={() => handleAddCategory(agent)}
												>
													Add Category
												</Menu.Item>
												{agent.status === 'Active' && (
													<Menu.Item
														icon={<IconX size={16} />}
														color="red"
														onClick={() => handleDeactivate(agent)}
													>
														Deactivate
													</Menu.Item>
												)}
											</Menu.Dropdown>
										</Menu>
									</Group>
								</Card.Section>

								<Card.Section className={classes.cardBody}>
									<Stack spacing="xs">
										<div className={classes.infoRow}>
											<IconMail
												size={16}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{agent.email}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconPhone
												size={16}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{agent.msisdn}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconMapPin
												size={16}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{agent.location}
											</Text>
										</div>
										{agent.merchantCode && (
											<div className={classes.infoRow}>
												<IconId
													size={16}
													color="gray"
												/>
												<Text
													size="sm"
													className={classes.merchantCode}
												>
													{agent.merchantCode}
												</Text>
											</div>
										)}
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group
										position="apart"
										align="center"
									>
										<Badge
											color={getStatusColor(agent.status)}
											variant="light"
											className={classes.statusBadge}
											leftSection={getStatusIcon(agent.status)}
										>
											{agent.status.replace('_', ' ').toUpperCase()}
										</Badge>
										<Text
											size="xs"
											color="dimmed"
										>
											{new Date(agent.createdAt).toLocaleDateString()}
										</Text>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))
				) : (
					<Grid.Col span={12}>
						<Text
							align="center"
							color="dimmed"
							size="lg"
						>
							No agents found matching your criteria
						</Text>
					</Grid.Col>
				)}
			</Grid>

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

			<AddAgentModal
				opened={addModalOpened}
				onClose={closeAddModal}
			/>

			{selectedAgent && (
				<EditAgentModal
					opened={editModalOpened}
					onClose={handleCloseEditModal}
					agent={selectedAgent}
				/>
			)}

			{selectedAgent && (
				<AgentApprovalModal
					opened={approvalModalOpened}
					onClose={handleCloseApprovalModal}
					agent={selectedAgent}
					action={
						selectedAgent.status === 'PendingApproval' ||
						selectedAgent.status === 'Inactive'
							? 'Approve'
							: 'Reject'
					}
				/>
			)}

			<AgentDuplicateCheckModal
				opened={duplicateCheckModalOpened}
				onClose={closeDuplicateCheckModal}
				onDuplicateFound={(result: any) => {
					console.log('Duplicate check result:', result);
					closeDuplicateCheckModal();
				}}
			/>

			{selectedAgent && (
				<AddAgentCategoryModal
					opened={addCategoryModalOpened}
					onClose={handleCloseAddCategoryModal}
					agent={selectedAgent}
				/>
			)}

			{selectedAgent && (
				<Modal
					opened={confirmationModalOpened}
					onClose={handleCloseConfirmationModal}
					title="Deactivate Agent"
					size="md"
					centered
				>
					<Stack spacing="lg">
						<Text>
							Are you sure you want to deactivate{' '}
							<strong>{selectedAgent.agentName}</strong>? This action cannot be
							undone.
						</Text>
						<Group position="right">
							<Button
								variant="outline"
								onClick={handleCloseConfirmationModal}
							>
								Cancel
							</Button>
							<Button
								color="red"
								onClick={handleConfirmDeactivate}
							>
								Deactivate
							</Button>
						</Group>
					</Stack>
				</Modal>
			)}
		</div>
	);
}
