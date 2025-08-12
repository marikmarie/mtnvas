import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Container,
	createStyles,
	Group,
	Paper,
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
	IconDeviceMobile,
	IconDownload,
	IconEye,
	IconFilter,
	IconPlus,
	IconReceipt,
	IconRefresh,
	IconSearch,
	IconTrendingUp,
	IconUser,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { toTitle } from '../../utils/toTitle';
import { Transaction, TransactionSummary } from '../Dealer/types';
import { CashSaleModal } from './CashSaleModal';
import { CustomerActivationModal } from './CustomerActivationModal';
import { SalesReportModal } from './SalesReportModal';

const useStyles = createStyles((theme) => ({
	root: {
		padding: 0,
	},

	header: {
		marginBottom: theme.spacing.xl,
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

	emptyState: {
		textAlign: 'center',
		padding: `calc(${theme.spacing.xl} * 2)`,
		color: theme.colors.gray[5],
	},

	badge: {
		fontWeight: 600,
	},

	actionButton: {
		'&:hover': {
			transform: 'scale(1.05)',
		},
	},
}));

export function TransactionList() {
	const { classes } = useStyles();
	const request = useRequest(true);

	// State for filters
	const [searchTerm, setSearchTerm] = useState('');
	const [agentFilter, setAgentFilter] = useState<string>('');
	const [dealerFilter, setDealerFilter] = useState<string>('');
	const [shopFilter, setShopFilter] = useState<string>('');
	const [typeFilter, setTypeFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
	const [dateFrom, setDateFrom] = useState<Date | null>(null);
	const [dateTo, setDateTo] = useState<Date | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 25;

	// Modal states
	const [activationModalOpened, { open: openActivationModal, close: closeActivationModal }] =
		useDisclosure(false);
	const [cashSaleModalOpened, { open: openCashSaleModal, close: closeCashSaleModal }] =
		useDisclosure(false);
	const [reportsModalOpened, { open: openReportsModal, close: closeReportsModal }] =
		useDisclosure(false);

	// Fetch transaction summary
	const { data: summaryData } = useQuery({
		queryKey: ['transactionSummary', dealerFilter, agentFilter, shopFilter],
		queryFn: () =>
			request.get('/transactions', {
				params: {
					summary: true,
					dealerId: dealerFilter || undefined,
					agentId: agentFilter || undefined,
					shopId: shopFilter || undefined,
				},
			}),
	});

	// Fetch transactions
	const fetchTransactions = useCallback(async () => {
		const params = {
			page: currentPage,
			limit: itemsPerPage,
			agentId: agentFilter || undefined,
			dealerId: dealerFilter || undefined,
			shopId: shopFilter || undefined,
			transactionType: typeFilter || undefined,
			status: statusFilter || undefined,
			paymentMethod: paymentMethodFilter || undefined,
			dateFrom: dateFrom?.toISOString().split('T')[0] || undefined,
			dateTo: dateTo?.toISOString().split('T')[0] || undefined,
		};

		const response = await request.get('/transactions', { params });
		return response.data;
	}, [
		request,
		currentPage,
		itemsPerPage,
		agentFilter,
		dealerFilter,
		shopFilter,
		typeFilter,
		statusFilter,
		paymentMethodFilter,
		dateFrom,
		dateTo,
	]);

	const {
		data: transactionsData,
		isLoading: transactionsLoading,
		refetch,
	} = useQuery({
		queryKey: [
			'transactions',
			currentPage,
			agentFilter,
			dealerFilter,
			shopFilter,
			typeFilter,
			statusFilter,
			paymentMethodFilter,
			dateFrom,
			dateTo,
		],
		queryFn: fetchTransactions,
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

	// const { data: shopsData } = useQuery({
	// 	queryKey: ['shops-lookup'],
	// 	queryFn: () => request.get('/lookups/shops'),
	// });

	const summary: TransactionSummary = summaryData?.data?.summary || {
		totalAmount: 0,
		totalCommission: 0,
		totalTransactions: 0,
	};

	const transactions: Transaction[] = transactionsData?.data?.data || [];
	// const totalPages = Math.ceil((transactionsData?.data?.meta?.total || 0) / itemsPerPage);

	// Filter transactions based on search term
	const filteredTransactions = transactions.filter(
		(transaction) =>
			searchTerm === '' ||
			transaction.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.imei.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleRefresh = () => {
		refetch();
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setAgentFilter('');
		setDealerFilter('');
		setShopFilter('');
		setTypeFilter('');
		setStatusFilter('');
		setPaymentMethodFilter('');
		setDateFrom(null);
		setDateTo(null);
		setCurrentPage(1);
	};

	const handleExportTransactions = () => {
		// Implement export functionality
		console.log('Exporting transactions...');
	};

	// Status badge colors
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'green';
			case 'pending':
				return 'yellow';
			case 'failed':
				return 'red';
			default:
				return 'gray';
		}
	};

	// Type badge colors
	const getTypeColor = (type: string) => {
		switch (type) {
			case 'activation':
				return 'blue';
			case 'cash_sale':
				return 'teal';
			default:
				return 'gray';
		}
	};

	// Payment method icons
	const getPaymentMethodIcon = (method: string) => {
		switch (method) {
			case 'cash':
				return <IconCash size={14} />;
			case 'mobile_money':
				return <IconDeviceMobile size={14} />;
			default:
				return <IconCash size={14} />;
		}
	};

	// Data grid columns
	const columns = [
		{
			name: 'receiptNumber',
			header: 'Receipt #',
			defaultFlex: 1,
			minWidth: 120,
		},
		{
			name: 'type',
			header: 'Type',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: Transaction }) => (
				<Badge
					color={getTypeColor(data.type)}
					variant="light"
					className={classes.badge}
				>
					{toTitle(data.type)}
				</Badge>
			),
		},
		{
			name: 'agentName',
			header: 'Agent',
			defaultFlex: 1,
			minWidth: 150,
		},
		{
			name: 'customerName',
			header: 'Customer',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: Transaction }) => data.customerName || 'N/A',
		},
		{
			name: 'productName',
			header: 'Product',
			defaultFlex: 1,
			minWidth: 120,
		},
		{
			name: 'amount',
			header: 'Amount',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: Transaction }) => formatCurrency(data.amount),
		},
		{
			name: 'paymentMethod',
			header: 'Payment',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: Transaction }) => (
				<Group spacing="xs">
					{getPaymentMethodIcon(data.paymentMethod)}
					<Text size="sm">{toTitle(data.paymentMethod)}</Text>
				</Group>
			),
		},
		{
			name: 'commission',
			header: 'Commission',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: Transaction }) => formatCurrency(data.commission),
		},
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: Transaction }) => (
				<Badge
					color={getStatusColor(data.status)}
					variant="light"
					className={classes.badge}
				>
					{toTitle(data.status)}
				</Badge>
			),
		},
		{
			name: 'createdAt',
			header: 'Date',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: Transaction }) =>
				new Date(data.createdAt).toLocaleDateString(),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			minWidth: 80,
			render: ({ data }: { data: Transaction }) => (
				<ActionIcon
					color="blue"
					variant="light"
					size="sm"
					className={classes.actionButton}
					onClick={() => console.log('View transaction details:', data.id)}
				>
					<IconEye size={16} />
				</ActionIcon>
			),
		},
	];

	const transactionTable = useDataGridTable<Transaction>({
		columns,
		data: filteredTransactions,
		loading: transactionsLoading,
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
							order={2}
							mb="xs"
						>
							Sales & Transactions
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Monitor sales activities, customer activations, and transaction history
						</Text>
					</div>

					<div className={classes.actionsSection}>
						<Button
							leftIcon={<IconPlus size={16} />}
							onClick={openActivationModal}
							radius="md"
						>
							Record Activation
						</Button>

						<Button
							leftIcon={<IconCash size={16} />}
							onClick={openCashSaleModal}
							color="teal"
							radius="md"
						>
							Cash Sale
						</Button>

						<Button
							leftIcon={<IconTrendingUp size={16} />}
							onClick={openReportsModal}
							variant="light"
							radius="md"
						>
							Sales Report
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
							onClick={handleExportTransactions}
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
					<Text className={classes.statValue}>{formatCurrency(summary.totalAmount)}</Text>
					<Text className={classes.statLabel}>Total Sales</Text>
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
						{formatCurrency(summary.totalCommission)}
					</Text>
					<Text className={classes.statLabel}>Total Commission</Text>
				</Card>

				<Card className={classes.statCard}>
					<div
						className={classes.statIcon}
						style={{ backgroundColor: 'rgba(30, 144, 255, 0.1)' }}
					>
						<IconReceipt
							size={24}
							color="#1E90FF"
						/>
					</div>
					<Text className={classes.statValue}>{summary.totalTransactions}</Text>
					<Text className={classes.statLabel}>Total Transactions</Text>
				</Card>
			</div>

			{/* Filters */}
			<Paper className={classes.filtersCard}>
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
						placeholder="Search transactions..."
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
						placeholder="Transaction Type"
						data={[
							{ value: '', label: 'All Types' },
							{ value: 'activation', label: 'Activation' },
							{ value: 'cash_sale', label: 'Cash Sale' },
						]}
						value={typeFilter}
						onChange={(value) => setTypeFilter(value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Status"
						data={[
							{ value: '', label: 'All Statuses' },
							{ value: 'completed', label: 'Completed' },
							{ value: 'pending', label: 'Pending' },
							{ value: 'failed', label: 'Failed' },
						]}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Payment Method"
						data={[
							{ value: '', label: 'All Methods' },
							{ value: 'cash', label: 'Cash' },
							{ value: 'mobile_money', label: 'Mobile Money' },
						]}
						value={paymentMethodFilter}
						onChange={(value) => setPaymentMethodFilter(value || '')}
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
			</Paper>

			{/* Transactions Table */}
			<Card className={classes.tableCard}>
				<div className={classes.tableHeader}>
					<Group position="apart">
						<Text
							weight={600}
							size="lg"
						>
							Transaction History
						</Text>
						<Text
							color="dimmed"
							size="sm"
						>
							{transactionsData?.data?.meta?.total || 0} transactions
						</Text>
					</Group>
				</div>

				{transactionTable}
			</Card>

			{/* Modals */}
			<CustomerActivationModal
				opened={activationModalOpened}
				onClose={closeActivationModal}
			/>

			<CashSaleModal
				opened={cashSaleModalOpened}
				onClose={closeCashSaleModal}
			/>

			<SalesReportModal
				opened={reportsModalOpened}
				onClose={closeReportsModal}
			/>
		</Container>
	);
}
