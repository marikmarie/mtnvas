import {
	ActionIcon,
	Badge,
	Button,
	createStyles,
	Group,
	Menu,
	Pagination,
	Select,
	Skeleton,
	Table,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconAlertCircle,
	IconCalendar,
	IconCheck,
	IconClock,
	IconDeviceMobile,
	IconDotsVertical,
	IconEye,
	IconFilter,
	IconRefresh,
	IconSearch,
	IconSettings,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Dealer, Stock } from '../Dealer/types';
import { statusMap } from '../Stock/StockList';
import { ImeiDetailsModal } from './ImeiDetailsModal';
import { ImeiSwapModal } from './ImeiSwapModal';
import { ImeiSwapRequestsModal } from './ImeiSwapRequestsModal';

const useStyles = createStyles((theme) => ({
	root: {
		padding: 0,
	},

	header: {
		marginBottom: theme.spacing.lg,
	},

	searchSection: {
		marginBottom: theme.spacing.lg,
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
	},

	searchRow: {
		display: 'flex',
		gap: theme.spacing.md,
		alignItems: 'flex-end',
		flexWrap: 'wrap',
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

	imeiText: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		fontWeight: 600,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		borderRadius: theme.radius.sm,
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
	},

	tableContainer: {
		overflowX: 'auto',
	},

	tableHeader: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		fontWeight: 600,
		textTransform: 'uppercase',
	},

	tableRow: {
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
		},
	},

	tableCell: {
		padding: `${theme.spacing.sm} ${theme.spacing.md}`,
		verticalAlign: 'middle',
	},
}));

export function ImeiList() {
	const { classes } = useStyles();
	const request = useRequest(true);
	const [selectedImei, setSelectedImei] = useState<string>('');
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [dealerFilter, setDealerFilter] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(12);

	const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] =
		useDisclosure(false);
	const [swapModalOpened, { open: openSwapModal, close: closeSwapModal }] = useDisclosure(false);
	const [requestsModalOpened, { open: openRequestsModal, close: closeRequestsModal }] =
		useDisclosure(false);

	const { data: stockData, isLoading } = useQuery({
		queryKey: ['stock', { statusFilter, dealerFilter, searchTerm, currentPage }],
		queryFn: () =>
			request.get('/stock', {
				params: {
					status: statusFilter !== 'all' ? statusFilter : undefined,
					dealerId: dealerFilter !== 'all' ? dealerFilter : undefined,
					search: searchTerm || undefined,
					page: currentPage,
					pageSize: itemsPerPage,
				},
			}),
	});

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/dealer'),
	});

	const uniqueDealers = dealersData?.data?.data?.map((dealer: Dealer) => ({
		value: dealer.id,
		label: dealer.dealerName.toUpperCase() || 'Unknown Dealer',
	}));

	const handleOpenDetails = (imei: string) => {
		setSelectedImei(imei);
		openDetailsModal();
	};

	const handleOpenSwap = (imei: string) => {
		setSelectedImei(imei);
		openSwapModal();
	};

	const imeiList: Stock[] = stockData?.data?.data || stockData?.data || [];
	const totalPages = Math.ceil((stockData?.data?.meta?.total || 0) / itemsPerPage);

	const getStatusColor = (status: number) => {
		switch (status) {
			case 1:
				return 'green';
			case 2:
				return 'blue';
			case 3:
				return 'orange';
			case 4:
				return 'red';
			case 5:
				return 'purple';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: number) => {
		switch (status) {
			case 1:
				return <IconCheck size={14} />;
			case 2:
				return <IconCheck size={14} />;
			case 3:
				return <IconClock size={14} />;
			case 4:
				return <IconX size={14} />;
			case 5:
				return <IconRefresh size={14} />;
			default:
				return <IconAlertCircle size={14} />;
		}
	};

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
							IMEI Management
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Track and manage device IMEI numbers across the network.
						</Text>
					</div>
					<Button
						leftIcon={<IconSettings size={16} />}
						variant="outline"
						onClick={openRequestsModal}
						size="md"
						radius="md"
						color="orange"
					>
						View Swap Requests
					</Button>
				</Group>
			</div>

			<div className={classes.searchSection}>
				<div className={classes.searchRow}>
					<TextInput
						placeholder="Search IMEI or sold by..."
						icon={<IconSearch size={16} />}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.currentTarget.value)}
						style={{ flex: 1, minWidth: 250 }}
					/>
					<Select
						placeholder="Filter by status"
						data={[
							{ value: 'all', label: 'All Status' },
							{ value: 'available', label: 'Available' },
							{ value: 'active', label: 'Active' },
							{ value: 'assigned', label: 'Assigned' },
							{ value: 'inactive', label: 'Inactive' },
							{ value: 'swapped', label: 'Swapped' },
						]}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
					<Select
						placeholder="Filter by dealer"
						data={[{ value: 'all', label: 'All Dealers' }, ...(uniqueDealers || [])]}
						value={dealerFilter}
						onChange={(value) => setDealerFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
				</div>
			</div>

			{isLoading ? (
				<div className={classes.tableContainer}>
					<Table
						striped
						highlightOnHover
						withColumnBorders
						withBorder
					>
						<thead>
							<tr>
								<th className={classes.tableHeader}>IMEI</th>
								<th className={classes.tableHeader}>Product</th>
								<th className={classes.tableHeader}>Device</th>
								<th className={classes.tableHeader}>Status</th>
								<th className={classes.tableHeader}>Sold By</th>
								<th className={classes.tableHeader}>Assigned At</th>
								<th className={classes.tableHeader}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 6 }).map((_, index) => (
								<tr
									key={index}
									className={classes.tableRow}
								>
									<td className={classes.tableCell}>
										<Group spacing="xs">
											<Skeleton
												height={24}
												width={24}
												radius="xl"
											/>
											<Skeleton
												height={12}
												width={180}
											/>
										</Group>
									</td>
									<td className={classes.tableCell}>
										<Skeleton
											height={12}
											width="80%"
										/>
									</td>
									<td className={classes.tableCell}>
										<Skeleton
											height={12}
											width="70%"
										/>
									</td>
									<td className={classes.tableCell}>
										<Skeleton
											height={24}
											width={100}
											radius="xl"
										/>
									</td>
									<td className={classes.tableCell}>
										<Skeleton
											height={12}
											width="70%"
										/>
									</td>
									<td className={classes.tableCell}>
										<Skeleton
											height={12}
											width="40%"
										/>
									</td>
									<td className={classes.tableCell}>
										<Skeleton
											height={24}
											width={24}
											radius="md"
										/>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			) : imeiList.length === 0 ? (
				<div className={classes.emptyState}>
					<IconDeviceMobile
						size={48}
						color="gray"
					/>
					<Text
						size="lg"
						mt="md"
					>
						No IMEI found
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
					<Table
						striped
						// highlightOnHover
						// withColumnBorders
						// withBorder
					>
						<thead>
							<tr>
								<th className={classes.tableHeader}>IMEI</th>
								<th className={classes.tableHeader}>Product</th>
								<th className={classes.tableHeader}>Device</th>
								<th className={classes.tableHeader}>Status</th>
								<th className={classes.tableHeader}>Sold By</th>
								<th className={classes.tableHeader}>Assigned At</th>
								<th className={classes.tableHeader}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{imeiList.map((imei: Stock) => (
								<tr
									key={imei.imei}
									className={classes.tableRow}
								>
									<td className={classes.tableCell}>
										<Group spacing="xs">
											<ThemeIcon
												size="md"
												radius="md"
												variant="light"
												color={getStatusColor(imei.status)}
											>
												<IconDeviceMobile size={16} />
											</ThemeIcon>
											<Text
												className={classes.imeiText}
												lineClamp={1}
											>
												{imei.imei}
											</Text>
										</Group>
									</td>
									<td className={classes.tableCell}>
										<Text
											size="sm"
											weight={500}
										>
											{imei.productName?.toUpperCase() || 'N/A'}
										</Text>
									</td>
									<td className={classes.tableCell}>
										<Text size="sm">
											{imei.deviceName?.toUpperCase() || 'N/A'}
										</Text>
									</td>
									<td className={classes.tableCell}>
										<Badge
											color={getStatusColor(imei.status)}
											variant="filled"
											size="sm"
											className={classes.statusBadge}
											leftSection={getStatusIcon(imei.status)}
										>
											{statusMap[imei.status as keyof typeof statusMap]}
										</Badge>
									</td>
									<td className={classes.tableCell}>
										<div className={classes.infoRow}>
											<IconUser
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
												lineClamp={1}
											>
												{imei.dealerName || 'Not assigned'}
											</Text>
										</div>
									</td>
									<td className={classes.tableCell}>
										<div className={classes.infoRow}>
											<IconCalendar
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{imei.assignedAt
													? new Date(imei.assignedAt).toLocaleDateString()
													: 'Not activated'}
											</Text>
										</div>
									</td>
									<td className={classes.tableCell}>
										<Group spacing="xs">
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
														icon={<IconEye size={16} />}
														onClick={() => handleOpenDetails(imei.imei)}
													>
														View Details
													</Menu.Item>
													<Menu.Item
														icon={<IconRefresh size={16} />}
														onClick={() => handleOpenSwap(imei.imei)}
													>
														Request Swap
													</Menu.Item>
												</Menu.Dropdown>
											</Menu>
										</Group>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
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

			<ImeiDetailsModal
				opened={detailsModalOpened}
				close={closeDetailsModal}
				imei={selectedImei}
			/>
			<ImeiSwapModal
				opened={swapModalOpened}
				close={closeSwapModal}
				selectedImei={selectedImei}
			/>
			<ImeiSwapRequestsModal
				opened={requestsModalOpened}
				close={closeRequestsModal}
			/>
		</div>
	);
}
