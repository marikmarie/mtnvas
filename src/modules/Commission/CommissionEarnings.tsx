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
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
	IconCash,
	IconCheck,
	IconDownload,
	IconFilter,
	IconRefresh,
	IconSearch,
	IconTrendingUp,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { toTitle } from '../../utils/toTitle';
import {
	Agent,
	CommissionEarning,
	CommissionEarningsResponse,
	CommissionEarningsSummary,
	Dealer,
} from '../Dealer/types';
import { BulkCommissionPaymentModal } from './BulkCommissionPaymentModal';

const useStyles = createStyles((theme) => ({
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

	statsInline: {
		display: 'flex',
		gap: theme.spacing.lg,
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

	statItemInline: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.sm,
		[theme.fn.smallerThan('md')]: {
			justifyContent: 'space-between',
			width: '100%',
		},
	},

	statIconInline: {
		padding: theme.spacing.xs,
		borderRadius: theme.radius.sm,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	statContentInline: {
		display: 'flex',
		flexDirection: 'column',
		gap: rem(2),
	},

	statValueInline: {
		fontSize: rem(16),
		fontWeight: 700,
		color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[9],
		lineHeight: 1.2,
	},

	statLabelInline: {
		fontSize: theme.fontSizes.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		fontWeight: 500,
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
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

	const [searchTerm, setSearchTerm] = useState('');
	const [agentFilter, setAgentFilter] = useState<string>('');
	const [dealerFilter, setDealerFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [dateFrom, setDateFrom] = useState<Date | null>(null);
	const [dateTo, setDateTo] = useState<Date | null>(null);
	const [selectedEarnings, setSelectedEarnings] = useState<CommissionEarning[]>([]);

	const [bulkPaymentModalOpened, { open: openBulkPaymentModal, close: closeBulkPaymentModal }] =
		useDisclosure(false);

	const fetchCommissionEarnings = useCallback(async () => {
		const params: Record<string, any> = {};

		if (agentFilter) {
			params.agentId = agentFilter;
		}
		if (dealerFilter) {
			params.dealerId = dealerFilter;
		}
		if (statusFilter) {
			params.status = statusFilter;
		}
		if (dateFrom) {
			params.dateFrom = dateFrom.toISOString().split('T')[0];
		}
		if (dateTo) {
			params.dateTo = dateTo.toISOString().split('T')[0];
		}

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

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('dealer'),
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents'],
		queryFn: () => request.get('/agents'),
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

	const commissionEarnings: CommissionEarning[] = earningsData?.data || [];
	const summary: CommissionEarningsSummary = earningsData?.summary || {
		totalEarned: 0,
		totalPaid: 0,
		totalPending: 0,
	};

	const filteredEarnings = commissionEarnings.filter(
		(earning) =>
			searchTerm === '' ||
			earning.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			earning.productName.toLowerCase().includes(searchTerm.toLowerCase())
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
		const pendingEarnings = selectedEarnings.filter((e) => e.status === 'Pending');
		if (pendingEarnings.length === 0) {
			alert('Please select pending earnings for payment.');
			return;
		}
		openBulkPaymentModal();
	};

	const handleExportEarnings = () => {
		console.log('Exporting earnings...');
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Paid':
				return 'green';
			case 'Pending':
				return 'yellow';
			case 'Cancelled':
				return 'red';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'Paid':
				return <IconCheck size={14} />;
			case 'Pending':
				return <IconCash size={14} />;
			case 'Cancelled':
				return <IconX size={14} />;
			default:
				return <IconCash size={14} />;
		}
	};

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
				new Date(data.earnedAt)
					.toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})
					.toUpperCase(),
		},
		{
			name: 'paidAt',
			header: 'Paid Date',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionEarning }) =>
				data.paidAt
					? new Date(data.paidAt)
							.toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})
							.toUpperCase()
					: 'N/A',
		},
		{
			name: 'createdAt',
			header: 'Created At',
			defaultFlex: 1,
			minWidth: 80,
			render: ({ data }: { data: CommissionEarning }) =>
				new Date(data.createdAt)
					.toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})
					.toUpperCase(),
		},
	];

	const earningsTable = useDataGridTable<CommissionEarning>({
		columns,
		data: filteredEarnings,
		loading: earningsLoading,
		mih: '50vh',
	});

	return (
		<>
			<div className={classes.header}>
				<div className={classes.headerContent}>
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
					<div className={classes.statsInline}>
						<div className={classes.statItemInline}>
							<div
								className={classes.statIconInline}
								style={{ backgroundColor: 'rgba(34, 139, 34, 0.1)' }}
							>
								<IconTrendingUp
									size={20}
									color="#228B22"
								/>
							</div>
							<div className={classes.statContentInline}>
								<Text className={classes.statValueInline}>
									{formatCurrency(summary.totalEarned)}
								</Text>
								<Text className={classes.statLabelInline}>Total Earned</Text>
							</div>
						</div>

						<div className={classes.statItemInline}>
							<div
								className={classes.statIconInline}
								style={{ backgroundColor: 'rgba(0, 128, 0, 0.1)' }}
							>
								<IconCheck
									size={20}
									color="#008000"
								/>
							</div>
							<div className={classes.statContentInline}>
								<Text className={classes.statValueInline}>
									{formatCurrency(summary.totalPaid)}
								</Text>
								<Text className={classes.statLabelInline}>Total Paid</Text>
							</div>
						</div>

						<div className={classes.statItemInline}>
							<div
								className={classes.statIconInline}
								style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}
							>
								<IconCash
									size={20}
									color="#FFA500"
								/>
							</div>
							<div className={classes.statContentInline}>
								<Text className={classes.statValueInline}>
									{formatCurrency(summary.totalPending)}
								</Text>
								<Text className={classes.statLabelInline}>Pending Payment</Text>
							</div>
						</div>
					</div>

					<div className={classes.filtersInline}>
						<div className={classes.filterItem}>
							<IconSearch size={16} />
							<TextInput
								placeholder="Search earnings..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.currentTarget.value)}
								radius="md"
								size="xs"
							/>
						</div>

						<div className={classes.filterItem}>
							<IconUser size={16} />
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
							<IconUser size={16} />
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
								placeholder="Status"
								data={[
									{ value: '', label: 'All Statuses' },
									{ value: 'Pending', label: 'Pending' },
									{ value: 'Paid', label: 'Paid' },
									{ value: 'Cancelled', label: 'Cancelled' },
								]}
								value={statusFilter}
								onChange={(value) => setStatusFilter(value || '')}
								radius="md"
								clearable
								size="xs"
							/>
						</div>

						<div className={classes.filterItem}>
							<IconFilter size={16} />
							<DatePickerInput
								value={dateFrom}
								onChange={setDateFrom}
								radius="md"
								clearable
								size="xs"
							/>
						</div>

						<div className={classes.filterItem}>
							<IconFilter size={16} />
							<DatePickerInput
								value={dateTo}
								onChange={setDateTo}
								radius="md"
								clearable
								size="xs"
							/>
						</div>
					</div>
				</div>
			</div>

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

			<BulkCommissionPaymentModal
				opened={bulkPaymentModalOpened}
				onClose={closeBulkPaymentModal}
				selectedEarnings={selectedEarnings}
			/>
		</>
	);
}
