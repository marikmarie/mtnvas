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
	IconCash,
	IconDeviceMobile,
	IconDownload,
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
		transition: 'transform 0.2s ease, box-shadow 0.2s ease',
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: theme.shadows.md,
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
		background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
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
	const [statusFilter, setStatusFilter] = useState<string>('');
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
		queryKey: ['dealers-lookup'],
		queryFn: () => request.get('/dealer'),
		retry: 2,
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents-lookup'],
		queryFn: () => request.get('/agents'),
		retry: 2,
	});

	const { data: productsData } = useQuery({
		queryKey: ['products-lookup'],
		queryFn: () => request.get('/products'),
		retry: 2,
	});

	const summary: TransactionSummary = transactionsData?.data?.summary || {
		totalAmount: 0,
		totalCommission: 0,
		totalTransactions: 0,
	};

	const transactions = transactionsData?.data?.data || [];
	const totalTransactions = transactionsData?.data?.meta?.total || 0;

	console.log(transactions);

	const filteredTransactions = transactions.filter(
		(transaction: Transaction) =>
			searchTerm === '' ||
			transaction.agentName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
			transaction.customerName?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
			transaction.receiptNumber?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
			transaction.imei.toLowerCase().includes(searchTerm.trim().toLowerCase())
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
				setStatusFilter(value as string);
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

	const totalPages = Math.ceil(totalTransactions / itemsPerPage);

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
			render: ({ data }: { data: Transaction }) => data.agentName || 'N/A',
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
			render: ({ data }: { data: Transaction }) => data.productName || 'N/A',
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
						onChange={(value) => handleFilterChange('dealer', value || '')}
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
						onChange={(value) => handleFilterChange('agent', value || '')}
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
						onChange={(value) => handleFilterChange('type', value || '')}
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
						onChange={(value) => handleFilterChange('status', value || '')}
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
						onChange={(value) => handleFilterChange('paymentMethod', value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Product"
						icon={<IconDeviceMobile size={16} />}
						data={[
							{ value: '', label: 'All Products' },
							...(productsData?.data?.data || []).map((product: any) => ({
								value: product.id,
								label: product.productName,
							})),
						]}
						value={productFilter}
						onChange={(value) => handleFilterChange('product', value || '')}
						radius="md"
						clearable
					/>

					<DatePickerInput
						value={dateFrom}
						onChange={(value) => handleFilterChange('dateFrom', value)}
						radius="md"
						clearable
						label="From Date"
					/>

					<DatePickerInput
						value={dateTo}
						onChange={(value) => handleFilterChange('dateTo', value)}
						radius="md"
						clearable
						label="To Date"
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
				onClose={closeActivationModal}
			/>

			<CashSaleModal
				opened={cashSaleModalOpened}
				onClose={closeCashSaleModal}
			/>
		</Container>
	);
}
