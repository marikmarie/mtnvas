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
	Pagination,
	Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconUserPlus,
	IconSearch,
	IconDotsVertical,
	IconUser,
	IconMapPin,
	IconMail,
	IconPhone,
	IconCheck,
	IconX,
	IconEdit,
	IconShield,
	IconClock,
	IconAlertCircle,
	IconId,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import { Agent } from '../Dealer/types';
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
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(12);

	// Modal states
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

	// Selected items
	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
	const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');

	const request = useRequest(true);
	const queryClient = useQueryClient();

	// Mock data - replace with actual API calls
	const mockAgents: Agent[] = [
		{
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			msisdn: '+256701234567',
			userType: 'shop_agent',
			dealerId: 'dealer1',
			shopId: 'shop1',
			merchantCode: 'MC001',
			status: 'active',
			location: 'Kampala Central',
			createdAt: '2024-01-15T10:00:00Z',
		},
		{
			id: '2',
			name: 'Jane Smith',
			email: 'jane.smith@example.com',
			msisdn: '+256702345678',
			userType: 'dsa',
			dealerId: 'dealer1',
			merchantCode: 'MC002',
			status: 'pending_approval',
			location: 'Kampala West',
			createdAt: '2024-01-16T14:30:00Z',
		},
		{
			id: '3',
			name: 'Mike Johnson',
			email: 'mike.johnson@example.com',
			msisdn: '+256703456789',
			userType: 'retailer',
			dealerId: 'dealer2',
			merchantCode: 'MC003',
			status: 'active',
			location: 'Entebbe',
			createdAt: '2024-01-17T09:15:00Z',
		},
	];

	// Mock dealers and shops for filters
	const mockDealers = [
		{ value: '', label: 'All Dealers' },
		{ value: 'dealer1', label: 'Tech Solutions Ltd' },
		{ value: 'dealer2', label: 'Digital Innovations' },
	];

	const mockShops = [
		{ value: '', label: 'All Shops' },
		{ value: 'shop1', label: 'Kampala Central Branch' },
		{ value: 'shop2', label: 'Entebbe Branch' },
	];

	const userTypes = [
		{ value: '', label: 'All Types' },
		{ value: 'shop_agent', label: 'Shop Agent' },
		{ value: 'dsa', label: 'DSA' },
		{ value: 'retailer', label: 'Retailer' },
	];

	const statuses = [
		{ value: '', label: 'All Statuses' },
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' },
		{ value: 'pending_approval', label: 'Pending Approval' },
	];

	// Filtered agents
	const filteredAgents = useMemo(() => {
		return mockAgents.filter((agent) => {
			const matchesSearch =
				agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				agent.msisdn.includes(searchTerm) ||
				(agent.merchantCode &&
					agent.merchantCode.toLowerCase().includes(searchTerm.toLowerCase()));

			const matchesDealer = !selectedDealer || agent.dealerId === selectedDealer;
			const matchesShop = !selectedShop || agent.shopId === selectedShop;
			const matchesUserType = !selectedUserType || agent.userType === selectedUserType;
			const matchesStatus = !selectedStatus || agent.status === selectedStatus;

			return (
				matchesSearch && matchesDealer && matchesShop && matchesUserType && matchesStatus
			);
		});
	}, [mockAgents, searchTerm, selectedDealer, selectedShop, selectedUserType, selectedStatus]);

	// Pagination
	const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
	const paginatedAgents = filteredAgents.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Handlers
	const handleAddAgent = () => {
		// Clear any previously selected agent when adding a new one
		setSelectedAgent(null);
		openAddModal();
	};

	const handleEditAgent = (agent: Agent) => {
		if (!agent) return;
		setSelectedAgent(agent);
		openEditModal();
	};

	const handleApproval = (agent: Agent, action: 'approve' | 'reject') => {
		if (!agent) return;
		setSelectedAgent(agent);
		setApprovalAction(action);
		openApprovalModal();
	};

	const handleDuplicateCheck = () => {
		// Clear any previously selected agent when checking duplicates
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
			// API call to deactivate agent
			await request.post(`/agents/${selectedAgent.id}/deactivate`, {
				reason: 'Deactivated by admin',
			});

			queryClient.invalidateQueries(['agents']);
			closeConfirmationModal();
			setSelectedAgent(null); // Clear selected agent
		} catch (error) {
			console.error('Error deactivating agent:', error);
		}
	};

	// Enhanced close handlers that also clear the selected agent
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

	// Cleanup effect to ensure modals are properly closed and agent is cleared
	useEffect(() => {
		// If no agent is selected, close all modals that require an agent
		if (!selectedAgent) {
			closeEditModal();
			closeApprovalModal();
			closeAddCategoryModal();
			closeConfirmationModal();
		}
	}, [selectedAgent]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'green';
			case 'inactive':
				return 'red';
			case 'pending_approval':
				return 'yellow';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'active':
				return <IconCheck size={16} />;
			case 'inactive':
				return <IconX size={16} />;
			case 'pending_approval':
				return <IconClock size={16} />;
			default:
				return <IconAlertCircle size={16} />;
		}
	};

	const getUserTypeColor = (userType: string) => {
		switch (userType) {
			case 'shop_agent':
				return 'yellow';
			case 'dsa':
				return 'purple';
			case 'retailer':
				return 'orange';
			default:
				return 'gray';
		}
	};

	const getUserTypeLabel = (userType: string) => {
		switch (userType) {
			case 'shop_agent':
				return 'Shop Agent';
			case 'dsa':
				return 'DSA';
			case 'retailer':
				return 'Retailer';
			default:
				return userType;
		}
	};

	return (
		<div className={classes.root}>
			{/* Header */}
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

			{/* Search and Filters */}
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
						data={mockDealers}
						clearable
						style={{ minWidth: 150 }}
					/>
					<Select
						placeholder="Select Shop"
						value={selectedShop}
						onChange={setSelectedShop}
						data={mockShops}
						clearable
						style={{ minWidth: 150 }}
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

			{/* Agents Grid */}
			<Grid gutter="md">
				{paginatedAgents.map((agent) => (
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
												{agent.name}
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
											{agent.status === 'pending_approval' && (
												<>
													<Menu.Item
														icon={<IconCheck size={16} />}
														color="green"
														onClick={() =>
															handleApproval(agent, 'approve')
														}
													>
														Approve
													</Menu.Item>
													<Menu.Item
														icon={<IconX size={16} />}
														color="red"
														onClick={() =>
															handleApproval(agent, 'reject')
														}
													>
														Reject
													</Menu.Item>
												</>
											)}
											<Menu.Item
												icon={<IconShield size={16} />}
												onClick={() => handleAddCategory(agent)}
											>
												Add Category
											</Menu.Item>
											{agent.status === 'active' && (
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
				))}
			</Grid>

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
					action={approvalAction}
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

			{/* Simple confirmation modal for agent deactivation */}
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
							<strong>{selectedAgent.name}</strong>? This action cannot be undone.
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
