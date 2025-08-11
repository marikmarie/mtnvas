import {
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
	Skeleton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconSearch,
	IconFilter,
	IconDotsVertical,
	IconDeviceMobile,
	IconUser,
	IconCalendar,
	IconTransfer,
	IconRefresh,
	IconCheck,
	IconX,
	IconAlertCircle,
	IconClock,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import useRequest from '../../hooks/useRequest';
import { ImeiSwapModal } from './ImeiSwapModal';
import { ImeiTransferModal } from './ImeiTransferModal';
import { Dealer, Imei } from './types';

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
	const [selectedImei, setSelectedImei] = useState<Imei | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [dealerFilter, setDealerFilter] = useState<string>('all');

	const [transferModalOpened, { open: openTransferModal, close: closeTransferModal }] =
		useDisclosure(false);
	const [swapModalOpened, { open: openSwapModal, close: closeSwapModal }] = useDisclosure(false);

	const { data: imeiData, isLoading } = useQuery({
		queryKey: ['imeis'],
		queryFn: () => request.get('/imeis'),
	});

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/dealers'),
	});

	const handleOpenTransfer = (imei: Imei) => {
		if (imei?.imei) {
			setSelectedImei(imei);
			openTransferModal();
		}
	};

	const handleOpenSwap = (imei: Imei) => {
		if (imei?.imei) {
			setSelectedImei(imei);
			openSwapModal();
		}
	};

	// Filter and search logic
	const filteredImeis = useMemo(() => {
		if (!imeiData?.data?.data) return [];

		return imeiData.data.data.filter((imei: Imei) => {
			const matchesSearch =
				imei.imei?.includes(searchTerm) ||
				imei.soldBy?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = statusFilter === 'all' || imei.status === statusFilter;
			const matchesDealer = dealerFilter === 'all' || imei.soldById === dealerFilter;

			return matchesSearch && matchesStatus && matchesDealer;
		});
	}, [imeiData?.data?.data, searchTerm, statusFilter, dealerFilter]);

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'available':
				return 'green';
			case 'active':
				return 'yellow';
			case 'assigned':
				return 'orange';
			case 'inactive':
				return 'red';
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
			default:
				return <IconAlertCircle size={14} />;
		}
	};

	return (
		<div className={classes.root}>
			{/* Enhanced Header */}
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
				</Group>
			</div>

			{/* Search and Filter Section */}
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
							...(dealersData?.data?.data || []).map((dealer: Dealer) => ({
								value: dealer.id,
								label: dealer.name,
							})),
						]}
						value={dealerFilter}
						onChange={(value) => setDealerFilter(value || 'all')}
						icon={<IconFilter size={16} />}
						style={{ minWidth: 150 }}
					/>
				</div>
			</div>

			{/* Enhanced Card Grid */}
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
			) : filteredImeis.length === 0 ? (
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
					{filteredImeis.map((imei: Imei) => (
						<Grid.Col
							key={imei.id}
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
													icon={<IconTransfer size={16} />}
													onClick={() => handleOpenTransfer(imei)}
												>
													Transfer IMEI
												</Menu.Item>
												<Menu.Item
													icon={<IconRefresh size={16} />}
													onClick={() => handleOpenSwap(imei)}
												>
													Swap IMEI
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
												{imei.soldBy || 'Not assigned'}
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
												{imei.date
													? new Date(imei.date).toLocaleDateString()
													: 'No date'}
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

			{/* Modals */}
			<ImeiTransferModal
				opened={transferModalOpened}
				onClose={closeTransferModal}
				imei={selectedImei?.imei || ''}
				fromDealer={
					dealersData?.data?.data?.find((d: Dealer) => d.id === selectedImei?.soldById)!
				}
				dealers={dealersData?.data?.data || []}
			/>
			<ImeiSwapModal
				opened={swapModalOpened}
				onClose={closeSwapModal}
				oldImei={selectedImei?.imei || ''}
			/>
		</div>
	);
}
