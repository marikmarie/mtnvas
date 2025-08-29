import {
	ActionIcon,
	Badge,
	Button,
	Collapse,
	createStyles,
	Divider,
	Grid,
	Group,
	Text,
	ThemeIcon,
	Title,
	Tooltip,
} from '@mantine/core';
import {
	IconBuilding,
	IconCalendar,
	IconChevronDown,
	IconChevronRight,
	IconMail,
	IconMapPin,
	IconPackage,
	IconPhone,
	IconUser,
	IconUsers,
	IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface DealerHierarchyModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
}

interface ShopHierarchy {
	agentCount: number;
	stockItemCount: number;
	shop: {
		id: number;
		shopName: string;
		dealerId: number;
		dealerName: string;
		region: string;
		location: string;
		status: string;
		createdBy: string | null;
		createdAt: string;
		updatedBy: string | null;
		updatedAt: string;
	};
	agents: Array<{
		id: number;
		shopId: number;
		dealerId: number;
		shopName: string | null;
		dealerName: string | null;
		agentName: string;
		msisdn: string;
		status: string;
		email: string;
		userType: string;
		merchantCode: string;
		region: string;
		location: string;
		nin: string | null;
		createdBy: string | null;
		createdAt: string;
		updatedBy: string | null;
		updatedAt: string;
	}>;
	stockItem: Array<{
		imei: string;
		serialNumber: string | null;
		productId: number;
		deviceId: number;
		dealerId: number;
		productName: string | null;
		deviceName: string | null;
		dealerName: string | null;
		status: number;
		soldAt: string | null;
		transferedOn: string | null;
		createdBy: string;
		assignedAt: string;
		updatedBy: string | null;
		uPdatedAt: string | null;
	}>;
}

interface DealerHierarchyResponse {
	dealer: Dealer;
	shopCount: number;
	shops: ShopHierarchy[];
}

const useStyles = createStyles((theme) => ({
	header: {
		padding: theme.spacing.lg,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	headerContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	headerLeft: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
	},

	headerRight: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
	},

	content: {
		padding: theme.spacing.lg,
		maxHeight: '70vh',
		overflowY: 'auto',
	},

	dealerInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.lg,
		marginBottom: theme.spacing.lg,
	},

	dealerHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: theme.spacing.md,
	},

	dealerStats: {
		display: 'flex',
		gap: theme.spacing.md,
		flexWrap: 'wrap',
	},

	statCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		padding: theme.spacing.sm,
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		minWidth: 100,
		textAlign: 'center',
	},

	shopCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		marginBottom: theme.spacing.md,
		overflow: 'hidden',
	},

	shopHeader: {
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		cursor: 'pointer',
		transition: 'all 0.2s ease',

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		},
	},

	shopContent: {
		padding: theme.spacing.md,
	},

	shopStats: {
		display: 'flex',
		gap: theme.spacing.md,
		marginBottom: theme.spacing.md,
	},

	agentSection: {
		marginBottom: theme.spacing.md,
	},

	stockSection: {
		marginBottom: theme.spacing.md,
	},

	sectionTitle: {
		fontSize: theme.fontSizes.sm,
		fontWeight: 600,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		marginBottom: theme.spacing.sm,
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
	},

	agentCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		padding: theme.spacing.sm,
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		marginBottom: theme.spacing.xs,
	},

	stockItem: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		padding: theme.spacing.sm,
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		marginBottom: theme.spacing.xs,
		fontFamily: 'monospace',
		fontSize: theme.fontSizes.xs,
	},

	statusBadge: {
		fontWeight: 600,
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.lg,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},

	actions: {
		padding: theme.spacing.lg,
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	closeButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'scale(1.05)',
		},
	},
}));

export function DealerHierarchyModal({ opened, onClose, dealer }: DealerHierarchyModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const [expandedShops, setExpandedShops] = useState<Set<number>>(new Set());

	const { data: hierarchyData, isLoading } = useQuery({
		queryKey: ['dealer-hierarchy', dealer.id],
		queryFn: () => request.get(`/dealers/${dealer.id}/hierarchy`),
		enabled: opened,
	});

	const toggleShopExpansion = (shopId: number) => {
		const newExpanded = new Set(expandedShops);
		if (newExpanded.has(shopId)) {
			newExpanded.delete(shopId);
		} else {
			newExpanded.add(shopId);
		}
		setExpandedShops(newExpanded);
	};

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'active':
				return 'green';
			case 'inactive':
				return 'red';
			case 'pendingapproval':
				return 'yellow';
			default:
				return 'gray';
		}
	};

	const getStockStatusColor = (status: number) => {
		switch (status) {
			case 1:
				return 'green'; // Available
			case 2:
				return 'red'; // Sold
			case 4:
				return 'blue'; // Transferred
			default:
				return 'gray';
		}
	};

	const getStockStatusText = (status: number) => {
		switch (status) {
			case 1:
				return 'Available';
			case 2:
				return 'Sold';
			case 4:
				return 'Transferred';
			default:
				return 'Unknown';
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (isLoading) {
		return (
			<Modal
				opened={opened}
				close={onClose}
				size="xl"
			>
				<div className={classes.content}>
					<Text>Loading dealer hierarchy...</Text>
				</div>
			</Modal>
		);
	}

	const hierarchy = hierarchyData?.data?.data as DealerHierarchyResponse;

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="xl"
		>
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<div className={classes.headerLeft}>
						<ThemeIcon
							size={40}
							radius="md"
							variant="light"
							color="blue"
						>
							<IconBuilding size={20} />
						</ThemeIcon>
						<div>
							<Title
								order={3}
								size="h4"
							>
								Dealer Hierarchy
							</Title>
							<Text
								color="dimmed"
								size="sm"
							>
								Complete organizational structure for {dealer.dealerName}
							</Text>
						</div>
					</div>
					<div className={classes.headerRight}>
						<Tooltip label="Close">
							<ActionIcon
								variant="subtle"
								size="sm"
								onClick={onClose}
								className={classes.closeButton}
							>
								<IconX size={16} />
							</ActionIcon>
						</Tooltip>
					</div>
				</div>
			</div>

			<div className={classes.content}>
				{/* Dealer Information */}
				<div className={classes.dealerInfo}>
					<div className={classes.dealerHeader}>
						<div>
							<Title
								order={4}
								mb="xs"
							>
								{dealer.dealerName}
							</Title>
							<Group spacing="md">
								<Badge
									color={getStatusColor(dealer.status)}
									variant="filled"
									size="sm"
									className={classes.statusBadge}
								>
									{dealer.status}
								</Badge>
								<Badge
									color="blue"
									variant="light"
									size="sm"
								>
									{dealer.department}
								</Badge>
							</Group>
						</div>
						<div className={classes.dealerStats}>
							<div className={classes.statCard}>
								<Text
									size="xs"
									color="dimmed"
								>
									Shops
								</Text>
								<Text
									size="lg"
									weight={700}
									color="blue"
								>
									{hierarchy?.shopCount || 0}
								</Text>
							</div>
							<div className={classes.statCard}>
								<Text
									size="xs"
									color="dimmed"
								>
									Total Agents
								</Text>
								<Text
									size="lg"
									weight={700}
									color="green"
								>
									{hierarchy?.shops?.reduce(
										(total, shop) => total + shop.agentCount,
										0
									) || 0}
								</Text>
							</div>
							<div className={classes.statCard}>
								<Text
									size="xs"
									color="dimmed"
								>
									Total Stock
								</Text>
								<Text
									size="lg"
									weight={700}
									color="orange"
								>
									{hierarchy?.shops?.reduce(
										(total, shop) => total + shop.stockItemCount,
										0
									) || 0}
								</Text>
							</div>
						</div>
					</div>

					<Grid>
						<Grid.Col span={6}>
							<Group spacing="xs">
								<IconMail
									size={16}
									color="gray"
								/>
								<Text size="sm">{dealer.email}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col span={6}>
							<Group spacing="xs">
								<IconPhone
									size={16}
									color="gray"
								/>
								<Text size="sm">{dealer.msisdn}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col span={6}>
							<Group spacing="xs">
								<IconMapPin
									size={16}
									color="gray"
								/>
								<Text size="sm">
									{dealer.location}, {dealer.region}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col span={6}>
							<Group spacing="xs">
								<IconCalendar
									size={16}
									color="gray"
								/>
								<Text size="sm">Created: {formatDate(dealer.createdAt)}</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</div>

				{/* Shops */}
				<Title
					order={4}
					mb="md"
				>
					Shops ({hierarchy?.shops?.length || 0})
				</Title>

				{hierarchy?.shops?.length === 0 ? (
					<div className={classes.emptyState}>
						<IconBuilding
							size={48}
							color="gray"
						/>
						<Text
							size="lg"
							mt="md"
						>
							No shops found
						</Text>
						<Text
							size="sm"
							color="dimmed"
						>
							This dealer doesn't have any shops yet.
						</Text>
					</div>
				) : (
					hierarchy?.shops?.map((shopHierarchy) => (
						<div
							key={shopHierarchy.shop.id}
							className={classes.shopCard}
						>
							<div
								className={classes.shopHeader}
								onClick={() => toggleShopExpansion(shopHierarchy.shop.id)}
							>
								<Group position="apart">
									<Group spacing="md">
										<ActionIcon
											variant="subtle"
											size="sm"
										>
											{expandedShops.has(shopHierarchy.shop.id) ? (
												<IconChevronDown size={16} />
											) : (
												<IconChevronRight size={16} />
											)}
										</ActionIcon>
										<ThemeIcon
											size="md"
											radius="md"
											variant="light"
											color="blue"
										>
											<IconBuilding size={16} />
										</ThemeIcon>
										<div>
											<Text
												weight={600}
												size="sm"
											>
												{shopHierarchy.shop.shopName.toUpperCase()}
											</Text>
											<Text
												size="xs"
												color="dimmed"
											>
												{shopHierarchy.shop.location},{' '}
												{shopHierarchy.shop.region}
											</Text>
										</div>
									</Group>
									<Group spacing="md">
										<Badge
											color={getStatusColor(shopHierarchy.shop.status)}
											variant="light"
											size="sm"
										>
											{shopHierarchy.shop.status}
										</Badge>
										<Group spacing="xs">
											<Badge
												color="green"
												variant="light"
												size="xs"
											>
												<IconUsers size={12} />
												{shopHierarchy.agentCount}
											</Badge>
											<Badge
												color="orange"
												variant="light"
												size="xs"
											>
												<IconPackage size={12} />
												{shopHierarchy.stockItemCount}
											</Badge>
										</Group>
									</Group>
								</Group>
							</div>

							<Collapse in={expandedShops.has(shopHierarchy.shop.id)}>
								<div className={classes.shopContent}>
									{/* Agents Section */}
									<div className={classes.agentSection}>
										<Text className={classes.sectionTitle}>
											<IconUser size={14} /> Agents (
											{shopHierarchy.agentCount})
										</Text>
										{shopHierarchy.agents.length === 0 ? (
											<Text
												size="sm"
												color="dimmed"
												ta="center"
												py="md"
											>
												No agents assigned to this shop
											</Text>
										) : (
											shopHierarchy.agents.map((agent) => (
												<div
													key={agent.id}
													className={classes.agentCard}
												>
													<Group position="apart">
														<div>
															<Text
																weight={600}
																size="sm"
															>
																{agent.agentName}
															</Text>
															<Text
																size="xs"
																color="dimmed"
															>
																{agent.email} • {agent.msisdn}
															</Text>
														</div>
														<Group spacing="xs">
															<Badge
																color={getStatusColor(agent.status)}
																variant="light"
																size="xs"
															>
																{agent.status}
															</Badge>
															<Badge
																color="blue"
																variant="light"
																size="xs"
															>
																{agent.userType}
															</Badge>
															{agent.merchantCode && (
																<Badge
																	color="purple"
																	variant="light"
																	size="xs"
																>
																	MC: {agent.merchantCode}
																</Badge>
															)}
														</Group>
													</Group>
												</div>
											))
										)}
									</div>

									<Divider my="md" />

									{/* Stock Section */}
									<div className={classes.stockSection}>
										<Text className={classes.sectionTitle}>
											<IconPackage size={14} /> Stock Items (
											{shopHierarchy.stockItemCount})
										</Text>
										{shopHierarchy.stockItem.length === 0 ? (
											<Text
												size="sm"
												color="dimmed"
												ta="center"
												py="md"
											>
												No stock items in this shop
											</Text>
										) : (
											shopHierarchy.stockItem.map((item) => (
												<div
													key={item.imei}
													className={classes.stockItem}
												>
													<Group position="apart">
														<div>
															<Text
																weight={600}
																size="xs"
															>
																IMEI: {item.imei}
															</Text>
															{item.serialNumber && (
																<Text
																	size="xs"
																	color="dimmed"
																>
																	SN: {item.serialNumber}
																</Text>
															)}
														</div>
														<Group spacing="xs">
															<Badge
																color={getStockStatusColor(
																	item.status
																)}
																variant="light"
																size="xs"
															>
																{getStockStatusText(item.status)}
															</Badge>
															{item.soldAt && (
																<Text
																	size="xs"
																	color="dimmed"
																>
																	Sold: {formatDate(item.soldAt)}
																</Text>
															)}
															{item.transferedOn && (
																<Text
																	size="xs"
																	color="dimmed"
																>
																	Transferred:{' '}
																	{formatDate(item.transferedOn)}
																</Text>
															)}
														</Group>
													</Group>
												</div>
											))
										)}
									</div>
								</div>
							</Collapse>
						</div>
					))
				)}
			</div>

			<div className={classes.actions}>
				<Group position="right">
					<Button
						variant="subtle"
						onClick={onClose}
						radius="md"
					>
						Close
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
