import {
	ActionIcon,
	Badge,
	createStyles,
	Grid,
	Group,
	Menu,
	Pagination,
	Paper,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconArrowRight,
	IconBuilding,
	IconCheck,
	IconDotsVertical,
	IconFilter,
	IconSearch,
	IconTransfer,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { Dealer, StockTransfer, StockTransferListParams } from '../Dealer/types';
import { StockTransferApprovalModal } from './StockTransferApprovalModal';

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

	summaryCards: {
		marginBottom: theme.spacing.lg,
	},

	summaryCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		height: '100%',
	},

	summaryValue: {
		fontSize: theme.fontSizes.xl,
		fontWeight: 700,
		marginBottom: theme.spacing.xs,
	},

	summaryLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
	},

	tableContainer: {
		overflowX: 'auto',
	},

	statusBadge: {
		fontWeight: 600,
	},

	transferArrow: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		color: theme.colors.gray[5],
	},

	transferRoute: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		fontSize: theme.fontSizes.sm,
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},

	imeiCount: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		borderRadius: theme.radius.sm,
		fontWeight: 600,
	},

	dateRange: {
		display: 'flex',
		gap: theme.spacing.sm,
		alignItems: 'center',
	},
}));

export function StockTransfersList() {
	const { classes } = useStyles();
	const request = useRequest(true);

	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [fromDealerFilter, setFromDealerFilter] = useState<string>('all');
	const [toDealerFilter, setToDealerFilter] = useState<string>('all');
	const [dateFrom] = useState<Date | null>(null);
	const [dateTo] = useState<Date | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	const [approvalModalOpened, { open: openApprovalModal, close: closeApprovalModal }] =
		useDisclosure(false);
	const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);
	const [approvalAction, setApprovalAction] = useState<'Approve' | 'Reject'>('Approve');

	// Fetch dealers for filters
	const { data: dealers } = useQuery({
		queryKey: ['dealer'],
		queryFn: () => request.get('/dealer'),
	});

	// Fetch transfers
	const { data: transfersData, isLoading } = useQuery({
		queryKey: [
			'stock-transfers',
			{
				page: currentPage,
				pageSize: itemsPerPage,
				status: statusFilter !== 'all' ? statusFilter : undefined,
				fromDealerId: fromDealerFilter !== 'all' ? parseInt(fromDealerFilter) : undefined,
				toDealerId: toDealerFilter !== 'all' ? parseInt(toDealerFilter) : undefined,
				from: dateFrom?.toISOString(),
				to: dateTo?.toISOString(),
			},
		],
		queryFn: () => {
			const params: StockTransferListParams = {
				page: currentPage,
				pageSize: itemsPerPage,
			};

			if (statusFilter !== 'all') params.status = statusFilter;
			if (fromDealerFilter !== 'all') params.fromDealerId = parseInt(fromDealerFilter);
			if (toDealerFilter !== 'all') params.toDealerId = parseInt(toDealerFilter);
			if (dateFrom) params.from = dateFrom.toISOString();
			if (dateTo) params.to = dateTo.toISOString();

			return request.get('/stock-transfers', { params });
		},
	});

	// Fetch transfer summary
	const { data: transferSummary } = useQuery({
		queryKey: ['stock-transfers/summary'],
		queryFn: () => request.get('/stock-transfers/summary'),
	});

	const dealerOptions = useMemo(() => {
		if (!dealers?.data?.data) return [];
		return dealers.data.data.map((dealer: Dealer) => ({
			value: dealer.id.toString(),
			label: dealer.dealerName?.toString() || 'Unknown Dealer',
		}));
	}, [dealers?.data?.data]);

	const filteredTransfers = useMemo(() => {
		if (!transfersData?.data?.data) return [];

		return transfersData.data.data.filter((transfer: StockTransfer) => {
			const matchesSearch =
				transfer.transferredBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				transfer.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				transfer.id.toString().toLowerCase().includes(searchTerm.toLowerCase());

			return matchesSearch;
		});
	}, [transfersData?.data?.data, searchTerm]);

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return 'yellow';
			case 'approved':
				return 'green';
			case 'rejected':
				return 'red';
			default:
				return 'gray';
		}
	};

	const handleApproveTransfer = (transfer: StockTransfer) => {
		setSelectedTransfer(transfer);
		setApprovalAction('Approve');
		openApprovalModal();
	};

	const handleRejectTransfer = (transfer: StockTransfer) => {
		setSelectedTransfer(transfer);
		setApprovalAction('Reject');
		openApprovalModal();
	};

	const totalPages = Math.ceil((transfersData?.data?.meta?.total || 0) / itemsPerPage);

	const columns = [
		{
			name: 'id',
			header: 'Transfer ID',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockTransfer }) => (
				<Text
					size="sm"
					weight={500}
					style={{ fontFamily: 'monospace' }}
				>
					{data.id.toString().slice(-8).toUpperCase()}
				</Text>
			),
		},
		{
			name: 'transferRoute',
			header: 'Transfer Route',
			defaultFlex: 1,
			minWidth: 200,
			render: ({ data }: { data: StockTransfer }) => (
				<div className={classes.transferRoute}>
					<Group spacing="xs">
						<IconBuilding
							size={14}
							color="gray"
						/>
						<Text
							size="sm"
							weight={500}
						>
							{
								(
									dealers?.data.data.find(
										(d: Dealer) =>
											d.id === data.fromDealerId
									) as unknown as Dealer
								).dealerName
							}
						</Text>
					</Group>
					<IconArrowRight
						size={16}
						color="gray"
					/>
					<Group spacing="xs">
						<IconBuilding
							size={14}
							color="gray"
						/>
						<Text
							size="sm"
							weight={500}
						>
							{
								(
									dealers?.data.data.find(
										(d: Dealer) =>
											d.id === data.toDealerId
									) as unknown as Dealer
								).dealerName
							}
						</Text>
					</Group>
				</div>
			),
		},
		{
			name: 'imeiCount',
			header: 'IMEI Count',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockTransfer }) => (
				<Badge
					color="blue"
					variant="light"
					size="sm"
					className={classes.imeiCount}
				>
					{data.imeiCount} items
				</Badge>
			),
		},
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockTransfer }) => (
				<Badge
					color={getStatusColor(data.status)}
					variant="light"
					size="sm"
				>
					{data.status}
				</Badge>
			),
		},
		{
			name: 'transferredBy',
			header: 'Transferred By',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: StockTransfer }) => (
				<Text size="sm">{data.transferredBy || 'Unknown'}</Text>
			),
		},
		{
			name: 'reason',
			header: 'Reason',
			defaultFlex: 1,
			minWidth: 200,
			render: ({ data }: { data: StockTransfer }) => (
				<Text
					size="sm"
					style={{ maxWidth: 200, wordBreak: 'break-word' }}
				>
					{data.reason || 'No reason provided'}
				</Text>
			),
		},
		{
			name: 'createdAt',
			header: 'Created Date',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockTransfer }) => (
				<Text size="sm">
					{new Date(data.createdAt).toLocaleDateString()}
				</Text>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: StockTransfer }) => (
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
						{data.status.toLowerCase() !== 'approved' && (
							<Menu.Item
								icon={<IconCheck size={16} />}
								color="green"
								onClick={() =>
									handleApproveTransfer(data)
								}
							>
								Approve
							</Menu.Item>
						)}
						{data.status.toLowerCase() !== 'rejected' && (
							<Menu.Item
								icon={<IconX size={16} />}
								color="red"
								onClick={() =>
									handleRejectTransfer(data)
								}
							>
								Reject
							</Menu.Item>
						)}
					</Menu.Dropdown>
				</Menu>
			),
		},
	];

	const transfersTable = useDataGridTable<StockTransfer>({
		columns,
		data: filteredTransfers,
		loading: isLoading,
		mih: '50vh',
	});

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
							Stock Transfers
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							View and manage stock transfer requests between dealers
						</Text>
					</div>
				</Group>
			</div>

			{transferSummary?.data && (
				<div className={classes.summaryCards}>
					<Grid>
						<Grid.Col
							xs={12}
							sm={6}
							md={3}
						>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="blue"
								>
									{transferSummary.data.total?.toLocaleString() || 0}
								</Text>
								<Text className={classes.summaryLabel}>Total Transfers</Text>
							</Paper>
						</Grid.Col>
						<Grid.Col
							xs={12}
							sm={6}
							md={3}
						>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="yellow"
								>
									{transferSummary.data.pending?.toLocaleString() || 0}
								</Text>
								<Text className={classes.summaryLabel}>Pending Approval</Text>
							</Paper>
						</Grid.Col>
						<Grid.Col
							xs={12}
							sm={6}
							md={3}
						>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="green"
								>
									{transferSummary.data.approved?.toLocaleString() || 0}
								</Text>
								<Text className={classes.summaryLabel}>Approved</Text>
							</Paper>
						</Grid.Col>
						<Grid.Col
							xs={12}
							sm={6}
							md={3}
						>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="red"
								>
									{transferSummary.data.rejected?.toLocaleString() || 0}
								</Text>
								<Text className={classes.summaryLabel}>Rejected</Text>
							</Paper>
						</Grid.Col>
					</Grid>
				</div>
			)}

			<div className={classes.searchSection}>
				<Stack spacing="md">
					<div className={classes.searchRow}>
						<TextInput
							placeholder="Search transfers..."
							icon={<IconSearch size={16} />}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.currentTarget.value)}
							style={{ flex: 1, minWidth: 250 }}
						/>
						<Select
							placeholder="Filter by status"
							data={[
								{ value: 'all', label: 'All Statuses' },
								{ value: 'Pending', label: 'Pending' },
								{ value: 'Approved', label: 'Approved' },
								{ value: 'Rejected', label: 'Rejected' },
							]}
							value={statusFilter}
							onChange={(value) => setStatusFilter(value || 'all')}
							icon={<IconFilter size={16} />}
							style={{ minWidth: 150 }}
						/>
						<Select
							placeholder="From dealer"
							data={[{ value: 'all', label: 'All Dealers' }, ...dealerOptions]}
							value={fromDealerFilter}
							onChange={(value) => setFromDealerFilter(value || 'all')}
							icon={<IconBuilding size={16} />}
							style={{ minWidth: 150 }}
						/>
						<Select
							placeholder="To dealer"
							data={[{ value: 'all', label: 'All Dealers' }, ...dealerOptions]}
							value={toDealerFilter}
							onChange={(value) => setToDealerFilter(value || 'all')}
							icon={<IconBuilding size={16} />}
							style={{ minWidth: 150 }}
						/>
					</div>
				</Stack>
			</div>

			{filteredTransfers.length === 0 && !isLoading ? (
				<div className={classes.emptyState}>
					<IconTransfer
						size={48}
						color="gray"
					/>
					<Text
						size="lg"
						mt="md"
					>
						No transfers found
					</Text>
					<Text
						size="sm"
						color="dimmed"
					>
						Try adjusting your search or filters
					</Text>
				</div>
			) : (
				<div className={classes.tableContainer}>
					{transfersTable}
				</div>
			)}

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

			<StockTransferApprovalModal
				opened={approvalModalOpened}
				onClose={closeApprovalModal}
				transfer={selectedTransfer}
				action={approvalAction}
			/>
		</div>
	);
}
