import {
	Badge,
	Button,
	Card,
	createStyles,
	Group,
	Pagination,
	Select,
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
	IconFilter,
	IconSearch,
	IconShield,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer, ImeiSwapRequestDetails } from '../Dealer/types';
import { ImeiSwapApprovalModal } from './ImeiSwapApprovalModal';

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

export function ImeiSwapRequestsModal({ opened, close }: { opened: boolean; close: () => void }) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [dealerFilter, setDealerFilter] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	const [selectedRequest, setSelectedRequest] = useState<ImeiSwapRequestDetails | null>(null);
	const [approvalModalOpened, { open: openApprovalModal, close: closeApprovalModal }] =
		useDisclosure(false);

	const { data: requestsData, isLoading } = useQuery({
		queryKey: ['imei-swap-requests', { statusFilter, dealerFilter, searchTerm, currentPage }],
		queryFn: () =>
			request.get('/imeis/swap-requests', {
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
		value: dealer.id.toString(),
		label: dealer.dealerName.toUpperCase() || 'Unknown Dealer',
	}));

	const requests: ImeiSwapRequestDetails[] = requestsData?.data?.data || requestsData?.data || [];
	const totalPages = Math.ceil((requestsData?.data?.meta?.total || 0) / itemsPerPage);

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

	const getStatusIcon = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return <IconClock size={14} />;
			case 'approved':
				return <IconCheck size={14} />;
			case 'rejected':
				return <IconX size={14} />;
			default:
				return <IconAlertCircle size={14} />;
		}
	};

	const handleApproveRequest = (request: ImeiSwapRequestDetails) => {
		setSelectedRequest(request);
		openApprovalModal();
	};

	const handleCloseApprovalModal = () => {
		closeApprovalModal();
		setSelectedRequest(null);
	};

	return (
		<>
			<Modal
				opened={opened}
				close={close}
				size="lg"
			>
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
									IMEI Swap Requests
								</Title>
								<Text
									color="dimmed"
									size="sm"
								>
									Review and manage IMEI swap requests from agents and dealers
								</Text>
							</div>
						</Group>
					</div>

					<div className={classes.searchSection}>
						<div className={classes.searchRow}>
							<TextInput
								placeholder="Search requests..."
								icon={<IconSearch size={16} />}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.currentTarget.value)}
								style={{ flex: 1, minWidth: 250 }}
							/>
							<Select
								placeholder="Filter by status"
								data={[
									{ value: 'all', label: 'All Status' },
									{ value: 'pending', label: 'Pending' },
									{ value: 'approved', label: 'Approved' },
									{ value: 'rejected', label: 'Rejected' },
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
									...(uniqueDealers || []),
								]}
								value={dealerFilter}
								onChange={(value) => setDealerFilter(value || 'all')}
								icon={<IconFilter size={16} />}
								style={{ minWidth: 150 }}
							/>
						</div>
					</div>

					{isLoading ? (
						<Stack spacing="md">
							<Text>Loading swap requests...</Text>
						</Stack>
					) : requests.length === 0 ? (
						<div className={classes.emptyState}>
							<IconDeviceMobile
								size={48}
								color="gray"
							/>
							<Text
								size="lg"
								mt="md"
							>
								No swap requests found
							</Text>
							<Text
								size="sm"
								color="dimmed"
							>
								Try adjusting your search or filters
							</Text>
						</div>
					) : (
						<Stack spacing="md">
							{requests.map((request) => (
								<Card
									key={request.id}
									className={classes.card}
									shadow="sm"
								>
									<Card.Section className={classes.cardHeader}>
										<Group position="apart">
											<Group spacing="xs">
												<ThemeIcon
													size="md"
													radius="md"
													variant="light"
													color={getStatusColor(request.status)}
												>
													<IconDeviceMobile size={16} />
												</ThemeIcon>
												<Text
													size="sm"
													weight={600}
												>
													Request #{request.id}
												</Text>
											</Group>
											<Group spacing="xs">
												<Badge
													color={getStatusColor(request.status)}
													variant="light"
													size="sm"
													className={classes.statusBadge}
													leftSection={getStatusIcon(request.status)}
												>
													{request.status.toUpperCase()}
												</Badge>
												{request.status === 'pending' && (
													<Button
														size="xs"
														color="blue"
														leftIcon={<IconShield size={14} />}
														onClick={() =>
															handleApproveRequest(request)
														}
													>
														Review
													</Button>
												)}
											</Group>
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
												>
													Requested by:{' '}
													{request.requestedBy.toUpperCase() ||
														'Unknown Agent'}
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
													Requested:{' '}
													{new Date(
														request.requestedAt
													).toLocaleDateString()}
												</Text>
											</div>
										</Stack>
									</Card.Section>

									<Card.Section className={classes.cardFooter}>
										<Group position="apart">
											<Group spacing="md">
												<div>
													<Text
														size="xs"
														color="dimmed"
														mb="xs"
													>
														Current IMEI
													</Text>
													<Text className={classes.imeiText}>
														{request.oldImei}
													</Text>
												</div>
												<IconDotsVertical
													size={16}
													color="gray"
												/>
												<div>
													<Text
														size="xs"
														color="dimmed"
														mb="xs"
													>
														New IMEI
													</Text>
													<Text className={classes.imeiText}>
														{request.newImei}
													</Text>
												</div>
											</Group>
											<Text
												size="sm"
												color="dimmed"
												lineClamp={2}
												style={{ maxWidth: 200 }}
											>
												{request.reason}
											</Text>
										</Group>
									</Card.Section>
								</Card>
							))}
						</Stack>
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
				</div>
			</Modal>

			{selectedRequest && (
				<ImeiSwapApprovalModal
					opened={approvalModalOpened}
					onClose={handleCloseApprovalModal}
					swapRequest={selectedRequest}
				/>
			)}
		</>
	);
}
