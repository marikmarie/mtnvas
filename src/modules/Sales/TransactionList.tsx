import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Container,
	createStyles,
	Group,
	Paper,
	rem,
	Select,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
	IconCalendar,
	IconCash,
	IconDeviceMobile,
	IconDownload,
	IconFilter,
	IconReceipt,
	IconRefresh,
	IconSearch,
	IconTrendingUp,
	IconUser,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { toTitle } from '../../utils/toTitle';
import { Agent, Dealer, Product, Transaction, TransactionSummary } from '../Dealer/types';
import { CashSaleModal } from './CashSaleModal';
import { CustomerActivationModal } from './CustomerActivationModal';

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
		background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
	},

	filtersGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
		gap: theme.spacing.md,
		alignItems: 'end',
	},

	tableCard: {
		padding: 0,
		overflow: 'hidden',
		borderRadius: theme.radius.lg,
		background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
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
		transition: 'transform 0.2s ease',
	},

	paginationContainer: {
		padding: theme.spacing.lg,
		borderTop: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		display: 'flex',
		justifyContent: 'center',
		gap: theme.spacing.sm,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},
}));

export function TransactionList() {
	const { classes } = useStyles();
	const request = useRequest(true);

	const [searchTerm, setSearchTerm] = useState('');
	const [agentFilter, setAgentFilter] = useState<string>('');
	const [dealerFilter, setDealerFilter] = useState<string>('');
	const [shopFilter, setShopFilter] = useState<string>('');
	const [typeFilter, setTypeFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | ''>('');
	const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
	const [productFilter, setProductFilter] = useState<string>('');
	const [dateFrom, setDateFrom] = useState<Date | null>(null);
	const [dateTo, setDateTo] = useState<Date | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 25;

	const [activationModalOpened, { open: openActivationModal, close: closeActivationModal }] =
		useDisclosure(false);
	const [cashSaleModalOpened, { open: openCashSaleModal, close: closeCashSaleModal }] =
		useDisclosure(false);
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(
		undefined
	);

	const fetchTransactions = useCallback(async () => {
		const params = {
			page: currentPage,
			pageSize: itemsPerPage,
			agentId: agentFilter || undefined,
			dealerId: dealerFilter || undefined,
			shopId: shopFilter || undefined,
			transactionType: typeFilter || undefined,
			status: statusFilter || undefined,
			dateFrom: dateFrom?.toISOString().split('T')[0] || undefined,
			dateTo: dateTo?.toISOString().split('T')[0] || undefined,
			productId: productFilter || undefined,
			paymentMethod: paymentMethodFilter || undefined,
		};

		const response = await request.get('/transactions', { params });
		return response;
	}, [
		request,
		currentPage,
		itemsPerPage,
		agentFilter,
		dealerFilter,
		shopFilter,
		typeFilter,
		statusFilter,
		dateFrom,
		dateTo,
		productFilter,
		paymentMethodFilter,
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
			productFilter,
			dateFrom,
			dateTo,
		],
		queryFn: fetchTransactions,
		retry: 2,
	});

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/dealer'),
		retry: 2,
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents'],
		queryFn: () => request.get('/agents'),
		retry: 2,
	});

	const { data: productsData } = useQuery({
		queryKey: ['products'],
		queryFn: () => request.get('/products'),
		retry: 2,
	});

	const agentOptions = useMemo(() => {
		if (!agentsData?.data?.data) return [];
		return agentsData.data.data.map((agent: Agent) => ({
			value: agent.id,
			label: agent.agentName.toUpperCase() || 'Unknown Agent',
		})) as unknown as { value: string; label: string }[];
	}, [agentsData?.data?.data]);

	const dealerOptions = useMemo(() => {
		if (!dealersData?.data?.data) return [];
		return dealersData.data.data.map((dealer: Dealer) => ({
			value: dealer.id,
			label: dealer.dealerName.toUpperCase() || 'Unknown Dealer',
		})) as unknown as { value: string; label: string }[];
	}, [dealersData?.data?.data]);

	const productOptions = useMemo(() => {
		if (!productsData?.data?.data) return [];
		return productsData.data.data.map((product: Product) => ({
			value: product.id,
			label: product.productName.toUpperCase() || 'Unknown Product',
		})) as unknown as { value: string; label: string }[];
	}, [productsData?.data?.data]);

	const summary: TransactionSummary = transactionsData?.data?.summary || {
		totalAmount: 0,
		totalCommission: 0,
		totalTransactions: 0,
	};

	const transactions = transactionsData?.data?.data || [];
	const totalTransactions = transactionsData?.data?.meta?.total || 0;

	const filteredTransactions = transactions.filter((transaction: Transaction) => {
		return (
			searchTerm === '' ||
			transaction.agentName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
			transaction.customerName?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
			transaction.receiptNumber?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
			transaction.imei.toLowerCase().includes(searchTerm.trim().toLowerCase())
		);
	});

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
		setProductFilter('');
		setDateFrom(null);
		setDateTo(null);
		setCurrentPage(1);
	};

	const handleFilterChange = (filterType: string, value: string | Date | null) => {
		setCurrentPage(1);

		switch (filterType) {
			case 'search':
				setSearchTerm(value as string);
				break;
			case 'agent':
				setAgentFilter(value as string);
				break;
			case 'dealer':
				setDealerFilter(value as string);
				break;
			case 'shop':
				setShopFilter(value as string);
				break;
			case 'type':
				setTypeFilter(value as string);
				break;
			case 'status':
				setStatusFilter(value as 'pending' | 'completed');
				break;
			case 'paymentMethod':
				setPaymentMethodFilter(value as string);
				break;
			case 'product':
				setProductFilter(value as string);
				break;
			case 'dateFrom':
				setDateFrom(value as Date | null);
				break;
			case 'dateTo':
				setDateTo(value as Date | null);
				break;
		}
	};

	const handleExportTransactions = () => {
		const headers = [
			'Receipt #',
			'Type',
			'Agent',
			'Customer',
			'Product',
			'Amount',
			'Payment Method',
			'Commission',
			'Status',
			'Date',
		];

		const csvData = filteredTransactions.map((transaction: Transaction) => [
			transaction.receiptNumber || 'N/A',
			toTitle(transaction.type),
			transaction.agentName,
			transaction.customerName || 'N/A',
			transaction.productName,
			transaction.amount,
			toTitle(transaction.paymentMethod),
			transaction.commission,
			toTitle(transaction.status),
			new Date(transaction.createdAt).toLocaleDateString(),
		]);

		const csvContent = [headers, ...csvData]
			.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(','))
			.join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleRecordActivation = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		openActivationModal();
	};

	const handleCloseActivationModal = () => {
		setSelectedTransaction(undefined);
		closeActivationModal();
	};

	const totalPages = Math.ceil(totalTransactions / itemsPerPage);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'gray';
			case 'pending':
				return 'yellow';
			case 'activated':
				return 'green';
			default:
				return 'gray';
		}
	};

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
			render: ({ data }: { data: Transaction }) => data.agentName?.toUpperCase() || 'N/A',
		},
		{
			name: 'customerName',
			header: 'Customer',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: Transaction }) => data.customerName?.toUpperCase() || 'N/A',
		},
		{
			name: 'productName',
			header: 'Product',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: Transaction }) => data.productName?.toUpperCase() || 'N/A',
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
				new Date(data.createdAt)
					.toLocaleString('en-UG', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						hour12: true,
						timeZone: 'Africa/Kampala',
					})
					.toUpperCase(),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: Transaction }) => (
				<Group spacing="xs">
					{data.status === 'pending' && (
						<Button
							size="xs"
							variant="light"
							color="blue"
							leftIcon={<IconDeviceMobile size={16} />}
							onClick={() => handleRecordActivation(data)}
							radius="md"
						>
							Record Activation
						</Button>
					)}
				</Group>
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
							leftIcon={<IconCash size={16} />}
							onClick={openCashSaleModal}
							radius="md"
						>
							New Sale
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
					<Text className={classes.statValue}>
						{transactionsLoading ? '...' : formatCurrency(summary.totalAmount)}
					</Text>
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
						{transactionsLoading ? '...' : formatCurrency(summary.totalCommission)}
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
					<Text className={classes.statValue}>
						{transactionsLoading ? '...' : transactionsData?.data?.totalCount}
					</Text>
					<Text className={classes.statLabel}>Total Transactions</Text>
				</Card>
			</div>

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
						onChange={(e) => handleFilterChange('search', e.currentTarget.value)}
						radius="md"
					/>

					<Select
						placeholder="Filter By All Dealers"
						icon={<IconUser size={16} />}
						data={[{ value: '', label: 'Filter By All Dealers' }, ...dealerOptions]}
						value={dealerFilter}
						onChange={(value) => handleFilterChange('dealer', value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Filter By All Agents"
						icon={<IconUser size={16} />}
						data={[{ value: '', label: 'Filter By All Agents' }, ...agentOptions]}
						value={agentFilter}
						onChange={(value) => handleFilterChange('agent', value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Transaction Type"
						data={[
							{ value: '', label: 'Filter By All Types' },
							{ value: 'activation', label: 'Activation' },
							{ value: 'cash_sale', label: 'Cash Sale' },
						]}
						value={typeFilter}
						onChange={(value) => handleFilterChange('type', value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Status"
						data={[
							{ value: '', label: 'Filter By All Status' },
							{ value: 'completed', label: 'Completed' },
							{ value: 'pending', label: 'Pending' },
							{ value: 'failed', label: 'Failed' },
						]}
						defaultValue={''}
						value={statusFilter}
						onChange={(value) => handleFilterChange('status', value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Filter By All Payment Methods"
						data={[
							{ value: '', label: 'Filter By All Payment Methods' },
							{ value: 'cash', label: 'Cash' },
							{ value: 'mobile_money', label: 'Mobile Money' },
						]}
						value={paymentMethodFilter}
						onChange={(value) => handleFilterChange('paymentMethod', value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Filter By All Products"
						icon={<IconDeviceMobile size={16} />}
						data={[{ value: '', label: 'Filter By All Products' }, ...productOptions]}
						value={productFilter}
						onChange={(value) => handleFilterChange('product', value || '')}
						radius="md"
						clearable
					/>

					<DatePickerInput
						value={dateFrom}
						// @ts-expect-error
						placeholder="From Date"
						onChange={(value) => handleFilterChange('dateFrom', value)}
						radius="md"
						icon={<IconCalendar size={16} />}
						clearable
					/>

					<DatePickerInput
						value={dateTo}
						// @ts-expect-error
						placeholder="To Date"
						onChange={(value) => handleFilterChange('dateTo', value)}
						radius="md"
						icon={<IconCalendar size={16} />}
						clearable
					/>
				</div>
			</Paper>

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
							{totalTransactions} transactions
						</Text>
					</Group>
				</div>

				{transactionsLoading ? (
					<div className={classes.emptyState}>
						<Text
							size="lg"
							weight={500}
							mb="md"
						>
							Loading transactions...
						</Text>
					</div>
				) : filteredTransactions.length === 0 ? (
					<div className={classes.emptyState}>
						<Text
							size="lg"
							weight={500}
							mb="md"
						>
							No transactions found
						</Text>
						<Text
							size="sm"
							color="dimmed"
						>
							{searchTerm ||
							agentFilter ||
							dealerFilter ||
							shopFilter ||
							typeFilter ||
							statusFilter ||
							paymentMethodFilter ||
							productFilter ||
							dateFrom ||
							dateTo
								? 'Try adjusting your filters or search terms'
								: 'No transactions have been recorded yet'}
						</Text>
					</div>
				) : (
					<>
						{transactionTable}

						{/* Pagination Controls */}
						{totalPages > 1 && (
							<div className={classes.paginationContainer}>
								<Button
									variant="light"
									size="sm"
									disabled={currentPage === 1}
									onClick={() => handlePageChange(currentPage - 1)}
								>
									Previous
								</Button>

								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									const page = i + 1;
									if (totalPages <= 5) {
										return (
											<Button
												key={page}
												variant={currentPage === page ? 'filled' : 'light'}
												size="sm"
												onClick={() => handlePageChange(page)}
											>
												{page}
											</Button>
										);
									}

									// Show first page, last page, current page, and pages around current
									if (
										page === 1 ||
										page === totalPages ||
										(page >= currentPage - 1 && page <= currentPage + 1)
									) {
										return (
											<Button
												key={page}
												variant={currentPage === page ? 'filled' : 'light'}
												size="sm"
												onClick={() => handlePageChange(page)}
											>
												{page}
											</Button>
										);
									}

									// Show ellipsis
									if (page === currentPage - 2 || page === currentPage + 2) {
										return (
											<Text
												key={page}
												size="sm"
												color="dimmed"
											>
												...
											</Text>
										);
									}

									return null;
								})}

								<Button
									variant="light"
									size="sm"
									disabled={currentPage === totalPages}
									onClick={() => handlePageChange(currentPage + 1)}
								>
									Next
								</Button>
							</div>
						)}
					</>
				)}
			</Card>

			<CustomerActivationModal
				opened={activationModalOpened}
				onClose={handleCloseActivationModal}
				transaction={selectedTransaction}
			/>

			<CashSaleModal
				opened={cashSaleModalOpened}
				onClose={closeCashSaleModal}
			/>
		</Container>
	);
}
