import {
	ActionIcon,
	Badge,
	Button,
	Card,
	createStyles,
	Grid,
	Group,
	Menu,
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
	IconCalendar,
	IconCheck,
	IconClock,
	IconDeviceMobile,
	IconDotsVertical,
	IconEye,
	IconFilter,
	IconPlus,
	IconRefresh,
	IconSearch,
	IconSettings,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Dealer, ImeiDetails } from '../Dealer/types';
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
	},

	searchRow: {
		display: 'flex',
		gap: theme.spacing.md,
		alignItems: 'flex-end',
		flexWrap: 'wrap',
	},

	card: {
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

	imeiText: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		fontWeight: 600,
	},

	actionButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'scale(1.05)',
		},
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
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

	const { data: imeiData, isLoading } = useQuery({
		queryKey: ['imeis', { statusFilter, dealerFilter, searchTerm, currentPage }],
		queryFn: () =>
			request.get('/imeis', {
				params: {
					status: statusFilter !== 'all' ? statusFilter : undefined,
					dealerId: dealerFilter !== 'all' ? dealerFilter : undefined,
					search: searchTerm || undefined,
					page: currentPage,
					limit: itemsPerPage,
				},
			}),
	});

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/lookups/dealers'),
	});

	const uniqueDealers = dealersData?.data?.data?.map((dealer: Dealer) => ({
		value: dealer.id,
		label: dealer.dealerName,
	}));

	const handleOpenDetails = (imei: string) => {
		setSelectedImei(imei);
		openDetailsModal();
	};

	const handleOpenSwap = (imei: string) => {
		setSelectedImei(imei);
		openSwapModal();
	};

	const imeiList: ImeiDetails[] = imeiData?.data?.data || [];
	const totalPages = Math.ceil((imeiData?.data?.meta?.total || 0) / itemsPerPage);

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'available':
				return 'green';
			case 'active':
				return 'blue';
			case 'assigned':
				return 'orange';
			case 'inactive':
				return 'red';
			case 'swapped':
				return 'purple';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'available':
				return <IconCheck size={14} />;
			case 'active':
				return <IconCheck size={14} />;
			case 'assigned':
				return <IconClock size={14} />;
			case 'inactive':
				return <IconX size={14} />;
			case 'swapped':
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
							Track and manage device IMEI numbers across the network
						</Text>
					</div>
					<Group spacing="md">
						<Button
							leftIcon={<IconSettings size={16} />}
							variant="outline"
							onClick={openRequestsModal}
							size="md"
							radius="md"
							color="orange"
						>
							Manage Swap Requests
						</Button>
						<Button
							leftIcon={<IconPlus size={16} />}
							onClick={() => handleOpenSwap('')}
							size="md"
							radius="md"
						>
							Request IMEI Swap
						</Button>
					</Group>
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
						data={[
							{ value: 'all', label: 'All Dealers' },
							...(uniqueDealers || []).map((dealer: Dealer) => ({
								value: dealer.id,
								label: dealer.dealerName,
							})),
						]}
						value={dealerFilter}
						onChange={(value) => setDealerFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
				</div>
			</div>

			{isLoading ? (
				<Grid>
					{Array.from({ length: 6 }).map((_, index) => (
						<Grid.Col
							key={index}
							xs={12}
							sm={6}
							lg={4}
						>
							<Card className={classes.card}>
								<Card.Section className={classes.cardHeader}>
									<Group position="apart">
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
										<Skeleton
											height={24}
											width={24}
											radius="md"
										/>
									</Group>
								</Card.Section>

								<Card.Section className={classes.cardBody}>
									<Stack spacing="xs">
										<Skeleton
											height={12}
											width="70%"
										/>
										<Skeleton
											height={12}
											width="40%"
										/>
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group position="apart">
										<Skeleton
											height={24}
											width={120}
											radius="xl"
										/>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
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
				<Grid>
					{imeiList.map((imei: ImeiDetails) => (
						<Grid.Col
							key={imei.imei}
							xs={12}
							sm={6}
							lg={4}
						>
							<Card className={classes.card}>
								<Card.Section className={classes.cardHeader}>
									<Group position="apart">
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
								</Card.Section>

								<Card.Section className={classes.cardBody}>
									<Stack spacing="xs">
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
												{imei.agentName || 'Not assigned'}
											</Text>
										</div>
										<div className={classes.infoRow}>
											<IconCalendar
												size={14}
												color="gray"
											/>
											<Text
												size="sm"
												color="dimmed"
											>
												{imei.activatedAt
													? new Date(
															imei.activatedAt
														).toLocaleDateString()
													: 'Not activated'}
											</Text>
										</div>
									</Stack>
								</Card.Section>

								<Card.Section className={classes.cardFooter}>
									<Group position="apart">
										<Badge
											color={getStatusColor(imei.status)}
											variant="filled"
											size="sm"
											className={classes.statusBadge}
											leftSection={getStatusIcon(imei.status)}
										>
											{imei.status?.charAt(0)?.toUpperCase() +
												imei.status?.slice(1)}
										</Badge>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					))}
				</Grid>
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
				onClose={closeDetailsModal}
				imei={selectedImei}
			/>
			<ImeiSwapModal
				opened={swapModalOpened}
				onClose={closeSwapModal}
				imei={selectedImei}
			/>
			<ImeiSwapRequestsModal
				opened={requestsModalOpened}
				onClose={closeRequestsModal}
			/>
		</div>
	);
}
