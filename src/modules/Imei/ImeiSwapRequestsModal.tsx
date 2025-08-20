import {
	ActionIcon,
	Badge,
	createStyles,
	Group,
	Modal,
	Pagination,
	Paper,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconCalendar,
	IconCheck,
	IconClock,
	IconEye,
	IconFilter,
	IconRefresh,
	IconSearch,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { ImeiSwapRequestDetails, ImeiSwapRequestsModalProps } from '../Dealer/types';
import { ImeiSwapApprovalModal } from './ImeiSwapApprovalModal';

const useStyles = createStyles((theme) => ({
	header: {
		padding: theme.spacing.lg,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	headerContent: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
	},

	content: {
		padding: theme.spacing.lg,
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
		textAlign: 'center',
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

	statusBadge: {
		fontWeight: 600,
	},

	imeiCode: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		borderRadius: theme.radius.sm,
	},

	requestsTable: {
		marginTop: theme.spacing.md,
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},

	actionButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'scale(1.05)',
		},
	},
}));

export function ImeiSwapRequestsModal({ opened, onClose }: ImeiSwapRequestsModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [selectedRequest, setSelectedRequest] = useState<ImeiSwapRequestDetails | null>(null);

	const [approvalModalOpened, { open: openApprovalModal, close: closeApprovalModal }] =
		useDisclosure(false);

	const { data: requestsData, isLoading } = useQuery({
		queryKey: ['imei-swap-requests', { statusFilter, searchTerm, currentPage }],
		queryFn: () =>
			request.get('/imeis/swap-requests', {
				params: {
					status: statusFilter !== 'all' ? statusFilter : undefined,
					search: searchTerm || undefined,
					page: currentPage,
					limit: itemsPerPage,
				},
			}),
		enabled: opened,
	});

	const requests: ImeiSwapRequestDetails[] = requestsData?.data?.data || [];
	const totalPages = Math.ceil((requestsData?.data?.meta?.total || 0) / itemsPerPage);

	const filteredRequests = useMemo(() => {
		return requests.filter((request) => {
			const matchesSearch =
				request.oldImei.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.newImei.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.reason.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [requests, searchTerm, statusFilter]);

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return 'orange';
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
				return <IconRefresh size={14} />;
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

	const summaryStats = useMemo(() => {
		const pending = requests.filter((r) => r.status === 'pending').length;
		const approved = requests.filter((r) => r.status === 'approved').length;
		const rejected = requests.filter((r) => r.status === 'rejected').length;
		return { total: requests.length, pending, approved, rejected };
	}, [requests]);

	return (
		<>
			<Modal
				opened={opened}
				onClose={onClose}
				size="xl"
				title="IMEI Swap Requests"
				centered
			>
				<div className={classes.header}>
					<div className={classes.headerContent}>
						<ThemeIcon
							size={40}
							radius="md"
							variant="light"
							color="orange"
						>
							<IconRefresh size={20} />
						</ThemeIcon>
						<div>
							<Title
								order={3}
								size="h4"
							>
								IMEI Swap Requests
							</Title>
							<Text
								color="dimmed"
								size="sm"
							>
								Manage and approve IMEI swap requests from agents
							</Text>
						</div>
					</div>
				</div>

				<div className={classes.content}>
					<div className={classes.summaryCards}>
						<Group grow>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="blue"
								>
									{summaryStats.total}
								</Text>
								<Text className={classes.summaryLabel}>Total Requests</Text>
							</Paper>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="orange"
								>
									{summaryStats.pending}
								</Text>
								<Text className={classes.summaryLabel}>Pending</Text>
							</Paper>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="green"
								>
									{summaryStats.approved}
								</Text>
								<Text className={classes.summaryLabel}>Approved</Text>
							</Paper>
							<Paper
								className={classes.summaryCard}
								shadow="xs"
							>
								<Text
									className={classes.summaryValue}
									color="red"
								>
									{summaryStats.rejected}
								</Text>
								<Text className={classes.summaryLabel}>Rejected</Text>
							</Paper>
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
						</div>
					</div>

					{isLoading ? (
						<Stack spacing="md">
							<Text>Loading swap requests...</Text>
						</Stack>
					) : filteredRequests.length === 0 ? (
						<div className={classes.emptyState}>
							<IconRefresh
								size={48}
								color="gray"
							/>
							<Text
								size="lg"
								mt="md"
							>
								No Swap Requests Found
							</Text>
							<Text
								size="sm"
								color="dimmed"
							>
								Try adjusting your search or filters
							</Text>
						</div>
					) : (
						<>
							<Table className={classes.requestsTable}>
								<thead>
									<tr>
										<th>Request ID</th>
										<th>Old IMEI</th>
										<th>New IMEI</th>
										<th>Agent</th>
										<th>Status</th>
										<th>Requested</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredRequests.map((request) => (
										<tr key={request.id}>
											<td>
												<Text
													size="sm"
													weight={500}
												>
													{request.id}
												</Text>
											</td>
											<td>
												<Text
													size="sm"
													className={classes.imeiCode}
												>
													{request.oldImei}
												</Text>
											</td>
											<td>
												<Text
													size="sm"
													className={classes.imeiCode}
												>
													{request.newImei}
												</Text>
											</td>
											<td>
												<Group spacing="xs">
													<IconUser
														size={16}
														color="gray"
													/>
													<Text size="sm">{request.agentName}</Text>
												</Group>
											</td>
											<td>
												<Badge
													color={getStatusColor(request.status)}
													variant="filled"
													size="sm"
													className={classes.statusBadge}
													leftSection={getStatusIcon(request.status)}
												>
													{request.status.toUpperCase()}
												</Badge>
											</td>
											<td>
												<Group spacing="xs">
													<IconCalendar
														size={16}
														color="gray"
													/>
													<Text size="sm">
														{new Date(
															request.requestedAt
														).toLocaleDateString()}
													</Text>
												</Group>
											</td>
											<td>
												<Group spacing="xs">
													{request.status === 'pending' && (
														<ActionIcon
															color="orange"
															variant="subtle"
															size="sm"
															className={classes.actionButton}
															onClick={() =>
																handleApproveRequest(request)
															}
														>
															<IconEye size={16} />
														</ActionIcon>
													)}
												</Group>
											</td>
										</tr>
									))}
								</tbody>
							</Table>

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
						</>
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
