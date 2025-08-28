import {
	ActionIcon,
	Badge,
	Button,
	Card,
	createStyles,
	Group,
	rem,
	Select,
	Text,
	TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconCurrencyDollar,
	IconEdit,
	IconFilter,
	IconPercentage,
	IconPlus,
	IconRefresh,
	IconSearch,
	IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { toTitle } from '../../utils/toTitle';
import { Agent, CommissionRate, Dealer, Product } from '../Dealer/types';
import { CommissionRateModal } from './CommissionRateModal';

const useStyles = createStyles((theme) => ({
	root: {
		padding: 0,
	},

	header: {
		marginBottom: theme.spacing.xl,
		marginTop: theme.spacing.xl,
	},

	headerContent: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: theme.spacing.md,
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: theme.spacing.md,
		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
			alignItems: 'stretch',
		},
	},

	titleSection: {
		flex: 1,
		minWidth: rem(200),
	},

	actionsSection: {
		display: 'flex',
		gap: theme.spacing.sm,
		flexWrap: 'wrap',
		alignItems: 'center',
		[theme.fn.smallerThan('md')]: {
			justifyContent: 'stretch',
			'& > *': {
				flex: 1,
			},
		},
	},

	filtersInline: {
		display: 'flex',
		gap: theme.spacing.sm,
		alignItems: 'center',
		padding: theme.spacing.sm,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
			gap: theme.spacing.md,
			width: '100%',
		},
	},

	filterItem: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		[theme.fn.smallerThan('md')]: {
			width: '100%',
		},
	},

	filtersCard: {
		marginBottom: theme.spacing.xl,
		padding: theme.spacing.lg,
		borderRadius: theme.radius.lg,
	},

	filtersGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
		gap: theme.spacing.md,
		alignItems: 'end',
	},

	tableCard: {
		padding: 0,
		overflow: 'hidden',
		borderRadius: theme.radius.lg,
	},

	tableHeader: {
		padding: theme.spacing.lg,
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	badge: {
		fontWeight: 600,
	},

	actionButton: {
		'&:hover': {
			transform: 'scale(1.05)',
		},
	},

	typeIcon: {
		marginRight: theme.spacing.xs,
	},
}));

export function CommissionRates() {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const [searchTerm, setSearchTerm] = useState('');
	const [dealerFilter, setDealerFilter] = useState<string>('');
	const [agentFilter, setAgentFilter] = useState<string>('');
	const [userTypeFilter, setUserTypeFilter] = useState<string>('');
	const [productFilter, setProductFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [selectedRate, setSelectedRate] = useState<CommissionRate | null>(null);

	const [rateModalOpened, { open: openRateModal, close: closeRateModal }] = useDisclosure(false);

	const fetchCommissionRates = useCallback(async () => {
		const params: Record<string, any> = {};

		if (dealerFilter && dealerFilter !== 'system') {
			params.dealerId = dealerFilter;
		}
		if (agentFilter) {
			params.agentId = agentFilter;
		}
		if (userTypeFilter) {
			params.userType = userTypeFilter;
		}
		if (productFilter) {
			params.productId = productFilter;
		}
		if (statusFilter) {
			params.isActive = statusFilter === 'active';
		}

		const response = await request.get('/commissions/rates', { params });
		return response.data;
	}, [request, dealerFilter, agentFilter, userTypeFilter, productFilter, statusFilter]);

	const {
		data: ratesData,
		isLoading: ratesLoading,
		refetch,
	} = useQuery({
		queryKey: [
			'commission-rates',
			dealerFilter,
			agentFilter,
			userTypeFilter,
			productFilter,
			statusFilter,
		],
		queryFn: fetchCommissionRates,
	});

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('dealer'),
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents'],
		queryFn: () => request.get('/agents'),
	});

	const { data: productsData } = useQuery({
		queryKey: ['products'],
		queryFn: () => request.get('/products'),
	});

	const dealerOptions = useMemo(() => {
		if (!dealersData?.data?.data || !Array.isArray(dealersData.data.data)) return [];
		return dealersData.data.data
			.filter((dealer: Dealer) => dealer && dealer.id && dealer.dealerName)
			.map((dealer: Dealer) => ({
				value: dealer.id.toString(),
				label: dealer.dealerName?.toString().toUpperCase() || 'Unknown Dealer',
			}));
	}, [dealersData?.data?.data]);

	const agentOptions = useMemo(() => {
		if (!agentsData?.data?.data || !Array.isArray(agentsData.data.data)) return [];
		return agentsData.data.data
			.filter((agent: Agent) => agent && agent.id && agent.agentName)
			.map((agent: Agent) => ({
				value: agent.id.toString(),
				label: agent.agentName?.toString().toUpperCase() || 'Unknown Agent',
			}));
	}, [agentsData?.data?.data]);

	const productOptions = useMemo(() => {
		if (!productsData?.data?.data || !Array.isArray(productsData.data.data)) return [];
		return productsData.data.data
			.filter((product: Product) => product && product.id && product.productName)
			.map((product: Product) => ({
				value: product.id.toString(),
				label: product.productName?.toString().toUpperCase() || 'Unknown Product',
			}));
	}, [productsData?.data?.data]);

	const deleteRateMutation = useMutation({
		mutationFn: async (rateId: string) => {
			await request.delete(`/commissions/rates/${rateId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['commission-rates']);
		},
	});

	const commissionRates: CommissionRate[] = ratesData?.data || [];

	const filteredRates = commissionRates.filter(
		(rate) =>
			searchTerm === '' ||
			rate.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			rate.userType.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleRefresh = () => {
		refetch();
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setDealerFilter('');
		setAgentFilter('');
		setUserTypeFilter('');
		setProductFilter('');
		setStatusFilter('');
	};

	const handleAddRate = () => {
		setSelectedRate(null);
		openRateModal();
	};

	const handleEditRate = (rate: CommissionRate) => {
		setSelectedRate(rate);
		openRateModal();
	};

	const handleDeleteRate = (rateId: string) => {
		if (confirm('Are you sure you want to delete this commission rate?')) {
			deleteRateMutation.mutate(rateId);
		}
	};

	const handleCloseRateModal = () => {
		setSelectedRate(null);
		closeRateModal();
	};

	const getCommissionTypeColor = (type: string) => {
		switch (type) {
			case 'fixed':
				return 'blue';
			case 'percentage':
				return 'green';
			default:
				return 'gray';
		}
	};

	const getUserTypeColor = (userType: string) => {
		switch (userType) {
			case 'shop_agent':
				return 'blue';
			case 'dsa':
				return 'teal';
			case 'retailer':
				return 'orange';
			case 'agent':
				return 'purple';
			default:
				return 'gray';
		}
	};

	const getStatusColor = (isActive: boolean) => {
		return isActive ? 'green' : 'red';
	};

	const columns = [
		{
			name: 'productName',
			header: 'Product',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: CommissionRate }) => (
				<Text
					size="sm"
					weight={500}
				>
					{data.productName?.toUpperCase()}
				</Text>
			),
		},
		{
			name: 'userType',
			header: 'User Type',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionRate }) => (
				<Badge
					color={getUserTypeColor(data.userType)}
					variant="light"
					className={classes.badge}
				>
					{toTitle(data.userType)}
				</Badge>
			),
		},
		{
			name: 'commissionType',
			header: 'Type',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: CommissionRate }) => (
				<Group spacing="xs">
					{data.commissionType === 'fixed' ? (
						<IconCurrencyDollar
							size={14}
							className={classes.typeIcon}
							color="blue"
							stroke={1.5}
						/>
					) : (
						<IconPercentage
							size={14}
							className={classes.typeIcon}
							color="blue"
							stroke={1.5}
						/>
					)}
					<Badge
						color={getCommissionTypeColor(data.commissionType)}
						variant="light"
						className={classes.badge}
					>
						{toTitle(data.commissionType)}
					</Badge>
				</Group>
			),
		},
		{
			name: 'amount',
			header: 'Amount',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionRate }) => (
				<Text weight={600}>
					{data.commissionType === 'fixed'
						? formatCurrency(data.amount)
						: `${data.amount}%`}
				</Text>
			),
		},
		{
			name: 'dealerName',
			header: 'Dealer',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: CommissionRate }) => (
				<Text
					size="sm"
					weight={500}
				>
					{data.dealerName?.toUpperCase() || 'ALL DEALERS'}
				</Text>
			),
		},
		{
			name: 'agentName',
			header: 'Agent',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: CommissionRate }) => (
				<Text
					size="sm"
					weight={500}
				>
					{data.agentName?.toUpperCase() || 'ALL AGENTS'}
				</Text>
			),
		},
		{
			name: 'effectiveFrom',
			header: 'Effective From',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionRate }) =>
				new Date(data.effectiveFrom).toLocaleDateString(),
		},
		{
			name: 'isActive',
			header: 'Status',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: CommissionRate }) => (
				<Badge
					color={getStatusColor(data.isActive)}
					variant="light"
					className={classes.badge}
				>
					{data.isActive ? 'Active' : 'Inactive'}
				</Badge>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionRate }) => (
				<Group spacing="xs">
					<ActionIcon
						color="blue"
						variant="light"
						size="sm"
						className={classes.actionButton}
						onClick={() => handleEditRate(data)}
					>
						<IconEdit size={16} />
					</ActionIcon>
					<ActionIcon
						color="red"
						variant="light"
						size="sm"
						className={classes.actionButton}
						onClick={() => handleDeleteRate(data.id)}
					>
						<IconTrash size={16} />
					</ActionIcon>
				</Group>
			),
		},
	];

	const ratesTable = useDataGridTable<CommissionRate>({
		columns,
		data: filteredRates,
		loading: ratesLoading,
		mih: '50vh',
	});

	return (
		<>
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<div className={classes.actionsSection}>
						<Button
							leftIcon={<IconPlus size={16} />}
							onClick={handleAddRate}
							radius="md"
						>
							Add Rate
						</Button>

						<Button
							variant="light"
							color="gray"
							onClick={handleClearFilters}
							radius="md"
						>
							Clear Filters
						</Button>

						<ActionIcon
							color="blue"
							variant="light"
							size="lg"
							onClick={handleRefresh}
							radius="md"
						>
							<IconRefresh size={18} />
						</ActionIcon>
					</div>

					<div className={classes.filtersInline}>
						<div className={classes.filterItem}>
							<IconSearch size={16} />
							<TextInput
								placeholder="Search rates..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.currentTarget.value)}
								radius="md"
								size="xs"
							/>
						</div>

						<div className={classes.filterItem}>
							<IconFilter size={16} />
							<Select
								placeholder="All Dealers"
								data={[{ value: '', label: 'All Dealers' }, ...dealerOptions]}
								value={dealerFilter}
								onChange={(value) => setDealerFilter(value || '')}
								radius="md"
								clearable
								size="xs"
							/>
						</div>

						<div className={classes.filterItem}>
							<IconFilter size={16} />
							<Select
								placeholder="All Agents"
								data={[{ value: '', label: 'All Agents' }, ...agentOptions]}
								value={agentFilter}
								onChange={(value) => setAgentFilter(value || '')}
								radius="md"
								clearable
								size="xs"
							/>
						</div>

						<div className={classes.filterItem}>
							<IconFilter size={16} />
							<Select
								placeholder="User Type"
								data={[
									{ value: '', label: 'All User Types' },
									{ value: 'shop_agent', label: 'Shop Agent' },
									{ value: 'dsa', label: 'DSA' },
									{ value: 'retailer', label: 'Retailer' },
									{ value: 'agent', label: 'Agent' },
								]}
								value={userTypeFilter}
								onChange={(value) => setUserTypeFilter(value || '')}
								radius="md"
								clearable
								size="xs"
							/>
						</div>

						<div className={classes.filterItem}>
							<IconFilter size={16} />
							<Select
								placeholder="Product"
								data={[{ value: '', label: 'All Products' }, ...productOptions]}
								value={productFilter}
								onChange={(value) => setProductFilter(value || '')}
								radius="md"
								clearable
								size="xs"
							/>
						</div>

						<div className={classes.filterItem}>
							<IconFilter size={16} />
							<Select
								placeholder="Status"
								data={[
									{ value: '', label: 'All Statuses' },
									{ value: 'active', label: 'Active' },
									{ value: 'inactive', label: 'Inactive' },
								]}
								value={statusFilter}
								onChange={(value) => setStatusFilter(value || '')}
								radius="md"
								clearable
								size="xs"
							/>
						</div>
					</div>
				</div>
			</div>

			<Card className={classes.tableCard}>
				<div className={classes.tableHeader}>
					<Group position="apart">
						<Text
							weight={600}
							size="lg"
						>
							Commission Rates
						</Text>
						<Text
							color="dimmed"
							size="sm"
						>
							{filteredRates.length} rates
						</Text>
					</Group>
				</div>

				{ratesTable}
			</Card>

			<CommissionRateModal
				opened={rateModalOpened}
				onClose={handleCloseRateModal}
				commissionRate={selectedRate}
			/>
		</>
	);
}
