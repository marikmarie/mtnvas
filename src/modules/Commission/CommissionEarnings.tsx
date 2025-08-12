import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Container,
	createStyles,
	Group,
	Select,
	Text,
	TextInput,
	Title,
	rem,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
	IconCash,
	IconCheck,
	IconDownload,
	IconEye,
	IconFilter,
	IconRefresh,
	IconSearch,
	IconTrendingUp,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { toTitle } from '../../utils/toTitle';
import {
	CommissionEarning,
	CommissionEarningsSummary,
	CommissionEarningsResponse,
} from '../Dealer/types';
import { BulkCommissionPaymentModal } from './BulkCommissionPaymentModal';

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
		alignItems: 'flex-start',
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
		[theme.fn.smallerThan('md')]: {
			justifyContent: 'stretch',
			'& > *': {
				flex: 1,
			},
		},
	},

	statsGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
		gap: theme.spacing.md,
		marginBottom: theme.spacing.xl,
	},

	statCard: {
		padding: theme.spacing.lg,
		borderRadius: theme.radius.lg,
		background:
			theme.colorScheme === 'dark'
				? `linear-gradient(135deg, ${theme.colors.dark[6]} 0%, ${theme.colors.dark[7]} 100%)`
				: `linear-gradient(135deg, ${theme.white} 0%, ${theme.colors.gray[0]} 100%)`,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		transition: 'all 0.2s ease',
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: theme.shadows.lg,
		},
	},

	statIcon: {
		padding: theme.spacing.sm,
		borderRadius: theme.radius.md,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: theme.spacing.md,
	},

	statValue: {
		fontSize: rem(24),
		fontWeight: 700,
		color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[9],
		marginBottom: rem(4),
	},

	statLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		fontWeight: 500,
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

	bulkActions: {
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.blue[9] : theme.colors.blue[0],
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[2]
		}`,
	},
}));

export function CommissionEarnings() {
	const { classes } = useStyles();
	const request = useRequest(true);

	// State for filters
	const [searchTerm, setSearchTerm] = useState('');
	const [agentFilter, setAgentFilter] = useState<string>('');
	const [dealerFilter, setDealerFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [dateFrom, setDateFrom] = useState<Date | null>(null);
	const [dateTo, setDateTo] = useState<Date | null>(null);
	const [selectedEarnings, setSelectedEarnings] = useState<CommissionEarning[]>([]);

	// Modal states
	const [bulkPaymentModalOpened, { open: openBulkPaymentModal, close: closeBulkPaymentModal }] =
		useDisclosure(false);

	// Fetch commission earnings
	const fetchCommissionEarnings = useCallback(async () => {
		const params = {
			agentId: agentFilter || undefined,
			dealerId: dealerFilter || undefined,
			status: statusFilter || undefined,
			dateFrom: dateFrom?.toISOString().split('T')[0] || undefined,
			dateTo: dateTo?.toISOString().split('T')[0] || undefined,
		};

		const response = await request.get('/commissions/earnings', { params });
		return response.data as CommissionEarningsResponse;
	}, [request, agentFilter, dealerFilter, statusFilter, dateFrom, dateTo]);

	const {
		data: earningsData,
		isLoading: earningsLoading,
		refetch,
	} = useQuery({
		queryKey: [
			'commission-earnings',
			agentFilter,
			dealerFilter,
			statusFilter,
			dateFrom,
			dateTo,
		],
		queryFn: fetchCommissionEarnings,
	});

	// Fetch lookup data
	const { data: dealersData } = useQuery({
		queryKey: ['dealers-lookup'],
		queryFn: () => request.get('/lookups/dealers'),
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents-lookup'],
		queryFn: () => request.get('/agents'),
	});

	const commissionEarnings: CommissionEarning[] = earningsData?.data || [];
	const summary: CommissionEarningsSummary = earningsData?.summary || {
		totalEarned: 0,
		totalPaid: 0,
		totalPending: 0,
	};

	// Filter earnings based on search term
	const filteredEarnings = commissionEarnings.filter(
		(earning) =>
			searchTerm === '' ||
			earning.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			earning.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			earning.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleRefresh = () => {
		refetch();
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setAgentFilter('');
		setDealerFilter('');
		setStatusFilter('');
		setDateFrom(null);
		setDateTo(null);
	};

	const handleBulkPayment = () => {
		const pendingEarnings = selectedEarnings.filter((e) => e.status === 'pending');
		if (pendingEarnings.length === 0) {
			alert('Please select pending earnings for payment.');
			return;
		}
		openBulkPaymentModal();
	};

	const handleExportEarnings = () => {
		console.log('Exporting earnings...');
	};

	// Get status badge color
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'paid':
				return 'green';
			case 'pending':
				return 'yellow';
			case 'cancelled':
				return 'red';
			default:
				return 'gray';
		}
	};

	// Get status icon
	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'paid':
				return <IconCheck size={14} />;
			case 'pending':
				return <IconCash size={14} />;
			case 'cancelled':
				return <IconX size={14} />;
			default:
				return <IconCash size={14} />;
		}
	};

	// Data grid columns
	const columns = [
		{
			name: 'transactionId',
			header: 'Transaction ID',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionEarning }) => (
				<Text
					size="sm"
					weight={500}
				>
					{data.transactionId}
				</Text>
			),
		},
		{
			name: 'agentName',
			header: 'Agent',
			defaultFlex: 1,
			minWidth: 150,
		},
		{
			name: 'productName',
			header: 'Product',
			defaultFlex: 1,
			minWidth: 120,
		},
		{
			name: 'commissionAmount',
			header: 'Commission',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionEarning }) => (
				<Text
					weight={600}
					color="green"
				>
					{formatCurrency(data.commissionAmount)}
				</Text>
			),
		},
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: CommissionEarning }) => (
				<Group spacing="xs">
					{getStatusIcon(data.status)}
					<Badge
						color={getStatusColor(data.status)}
						variant="light"
						className={classes.badge}
					>
						{toTitle(data.status)}
					</Badge>
				</Group>
			),
		},
		{
			name: 'earnedAt',
			header: 'Earned Date',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionEarning }) =>
				new Date(data.earnedAt).toLocaleDateString(),
		},
		{
			name: 'paidAt',
			header: 'Paid Date',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionEarning }) =>
				data.paidAt ? new Date(data.paidAt).toLocaleDateString() : 'N/A',
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			minWidth: 80,
			render: ({ data }: { data: CommissionEarning }) => (
				<ActionIcon
					color="blue"
					variant="light"
					size="sm"
					className={classes.actionButton}
					onClick={() => console.log('View earning details:', data.id)}
				>
					<IconEye size={16} />
				</ActionIcon>
			),
		},
	];

	const earningsTable = useDataGridTable<CommissionEarning>({
		columns,
		data: filteredEarnings,
		loading: earningsLoading,
		mih: '50vh',
	});

	return (
		<Container
			fluid
			className={classes.root}
		>
			{/* Header */}
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<div className={classes.titleSection}>
						<Title
							order={3}
							mb="xs"
						>
							Commission Earnings
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Track and manage commission earnings for agents
						</Text>
					</div>

					<div className={classes.actionsSection}>
						<Button
							leftIcon={<IconCash size={16} />}
							onClick={handleBulkPayment}
							color="green"
							radius="md"
							disabled={selectedEarnings.length === 0}
						>
							Bulk Payment
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

						<ActionIcon
							color="green"
							variant="light"
							size="lg"
							onClick={handleExportEarnings}
							radius="md"
						>
							<IconDownload size={18} />
						</ActionIcon>
					</div>
				</div>
			</div>

			{/* Summary Statistics */}
			<div className={classes.statsGrid}>
				<Card className={classes.statCard}>
					<div
						className={classes.statIcon}
						style={{ backgroundColor: 'rgba(34, 139, 34, 0.1)' }}
					>
						<IconTrendingUp
							size={24}
							color="#228B22"
						/>
					</div>
					<Text className={classes.statValue}>{formatCurrency(summary.totalEarned)}</Text>
					<Text className={classes.statLabel}>Total Earned</Text>
				</Card>

				<Card className={classes.statCard}>
					<div
						className={classes.statIcon}
						style={{ backgroundColor: 'rgba(0, 128, 0, 0.1)' }}
					>
						<IconCheck
							size={24}
							color="#008000"
						/>
					</div>
					<Text className={classes.statValue}>{formatCurrency(summary.totalPaid)}</Text>
					<Text className={classes.statLabel}>Total Paid</Text>
				</Card>

				<Card className={classes.statCard}>
					<div
						className={classes.statIcon}
						style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}
					>
						<IconCash
							size={24}
							color="#FFA500"
						/>
					</div>
					<Text className={classes.statValue}>
						{formatCurrency(summary.totalPending)}
					</Text>
					<Text className={classes.statLabel}>Pending Payment</Text>
				</Card>
			</div>

			{/* Filters */}
			<Card className={classes.filtersCard}>
				<Group
					position="apart"
					mb="md"
				>
					<Group>
						<IconFilter size={20} />
						<Text weight={600}>Filters</Text>
					</Group>

					<Button
						variant="subtle"
						size="xs"
						onClick={handleClearFilters}
					>
						Clear All
					</Button>
				</Group>

				<div className={classes.filtersGrid}>
					<TextInput
						placeholder="Search earnings..."
						icon={<IconSearch size={16} />}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.currentTarget.value)}
						radius="md"
					/>

					<Select
						placeholder="All Dealers"
						icon={<IconUser size={16} />}
						data={[
							{ value: '', label: 'All Dealers' },
							...(dealersData?.data?.data || []).map((dealer: any) => ({
								value: dealer.id,
								label: dealer.name,
							})),
						]}
						value={dealerFilter}
						onChange={(value) => setDealerFilter(value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="All Agents"
						icon={<IconUser size={16} />}
						data={[
							{ value: '', label: 'All Agents' },
							...(agentsData?.data?.data || []).map((agent: any) => ({
								value: agent.id,
								label: agent.name,
							})),
						]}
						value={agentFilter}
						onChange={(value) => setAgentFilter(value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Status"
						data={[
							{ value: '', label: 'All Statuses' },
							{ value: 'pending', label: 'Pending' },
							{ value: 'paid', label: 'Paid' },
							{ value: 'cancelled', label: 'Cancelled' },
						]}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value || '')}
						radius="md"
						clearable
					/>

					<DatePickerInput
						value={dateFrom}
						onChange={setDateFrom}
						radius="md"
						clearable
					/>

					<DatePickerInput
						value={dateTo}
						onChange={setDateTo}
						radius="md"
						clearable
					/>
				</div>
			</Card>

			{/* Commission Earnings Table */}
			<Card className={classes.tableCard}>
				{selectedEarnings.length > 0 && (
					<div className={classes.bulkActions}>
						<Group position="apart">
							<Text
								size="sm"
								weight={500}
							>
								{selectedEarnings.length} earnings selected
							</Text>
							<Group spacing="sm">
								<Button
									size="xs"
									variant="light"
									onClick={() => setSelectedEarnings([])}
								>
									Clear Selection
								</Button>
								<Button
									size="xs"
									color="green"
									onClick={handleBulkPayment}
								>
									Process Payment
								</Button>
							</Group>
						</Group>
					</div>
				)}

				<div className={classes.tableHeader}>
					<Group position="apart">
						<Text
							weight={600}
							size="lg"
						>
							Commission Earnings
						</Text>
						<Text
							color="dimmed"
							size="sm"
						>
							{filteredEarnings.length} earnings
						</Text>
					</Group>
				</div>

				{earningsTable}
			</Card>

			{/* Modals */}
			<BulkCommissionPaymentModal
				opened={bulkPaymentModalOpened}
				onClose={closeBulkPaymentModal}
				selectedEarnings={selectedEarnings}
			/>
		</Container>
	);
}
