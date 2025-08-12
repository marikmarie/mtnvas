import {
	Badge,
	Button,
	Group,
	Stack,
	Text,
	Title,
	createStyles,
	ThemeIcon,
	Paper,
	ActionIcon,
	Tooltip,
} from '@mantine/core';
import {
	IconBuilding,
	IconCalendar,
	IconMail,
	IconPhone,
	IconUser,
	IconEye,
	IconExternalLink,
	IconCopy,
	IconX,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import { Dealer, DealerAdmin, DealerDetailsResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import useRequest from '../../hooks/useRequest';
import { useDisclosure } from '@mantine/hooks';
import { Menu } from '@mantine/core';
import { IconDotsVertical, IconUserEdit, IconPower } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditDealerAdminModal } from './EditDealerAdminModal';
import { useState } from 'react';

interface ViewDealerModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
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
	},

	infoSection: {
		marginBottom: theme.spacing.lg,
	},

	sectionTitle: {
		fontSize: theme.fontSizes.sm,
		fontWeight: 600,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		marginBottom: theme.spacing.sm,
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
	},

	infoCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.sm,
	},

	infoRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.spacing.xs,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]}`,

		'&:last-child': {
			borderBottom: 'none',
		},
	},

	infoLabel: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		fontWeight: 500,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
	},

	infoValue: {
		fontWeight: 600,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[8],
	},

	linkValue: {
		fontWeight: 600,
		color: theme.colors.yellow[6],
		cursor: 'pointer',
		textDecoration: 'none',

		'&:hover': {
			textDecoration: 'underline',
		},
	},

	statusBadge: {
		fontWeight: 600,
	},

	categoryBadge: {
		fontWeight: 500,
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

export function ViewDealerModal({ opened, onClose, dealer }: ViewDealerModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();
	const [editAdminOpened, { open: openEditAdmin, close: closeEditAdmin }] = useDisclosure(false);
	const [selectedAdmin, setSelectedAdmin] = useState<DealerAdmin | null>(null);

	const { data, isLoading } = useQuery({
		queryKey: ['dealer-details', dealer.id],
		queryFn: () => request.get(`/dealer-groups/${dealer.id}`),
		enabled: opened && !!dealer?.id,
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const getStatusColor = (status: string) => {
		return status === 'active' ? 'green' : 'red';
	};

	const getCategoryColor = (category: string) => {
		switch (category?.toLowerCase()) {
			case 'wakanet':
				return 'yellow';
			case 'enterprise':
				return 'purple';
			case 'both':
				return 'orange';
			default:
				return 'gray';
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const details: DealerDetailsResponse | undefined = data?.data;

	const deactivateAdmin = useMutation({
		mutationFn: (adminId: string) =>
			request.post(`/dealer-groups/${dealer.id}/admins/${adminId}/deactivate`, {}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dealer-details', dealer.id] });
		},
	});

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
		>
			{/* Enhanced Header */}
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<div className={classes.headerLeft}>
						<ThemeIcon
							size={40}
							radius="md"
							variant="light"
							color="yellow"
						>
							<IconEye size={20} />
						</ThemeIcon>
						<div>
							<Title
								order={3}
								size="h4"
							>
								Dealer Details
							</Title>
							<Text
								color="dimmed"
								size="sm"
							>
								View complete dealer information
							</Text>
						</div>
					</div>
					<div className={classes.headerRight}>
						<Tooltip label="Copy dealer ID">
							<ActionIcon
								variant="subtle"
								size="sm"
								onClick={() => copyToClipboard(dealer.id)}
							>
								<IconCopy size={16} />
							</ActionIcon>
						</Tooltip>
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

			{/* Content */}
			<div className={classes.content}>
				{isLoading ? (
					<Text color="dimmed">Loading dealer details...</Text>
				) : (
					<>
						{/* Company Information */}
						<div className={classes.infoSection}>
							<Text className={classes.sectionTitle}>Company Information</Text>
							<Paper
								className={classes.infoCard}
								shadow="xs"
							>
								<Stack spacing="xs">
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>
											<IconBuilding size={16} />
											Company Name
										</div>
										<Text className={classes.infoValue}>
											{details?.dealer.companyName || dealer.name}
										</Text>
									</div>
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>Status</div>
										<Badge
											color={getStatusColor(dealer.status)}
											variant="filled"
											size="sm"
											className={classes.statusBadge}
										>
											{dealer.status?.charAt(0)?.toUpperCase() +
												dealer.status?.slice(1)}
										</Badge>
									</div>
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>Category</div>
										<Badge
											color={getCategoryColor(dealer.category)}
											variant="light"
											size="sm"
											className={classes.categoryBadge}
										>
											{dealer.category?.charAt(0)?.toUpperCase() +
												dealer.category?.slice(1)}
										</Badge>
									</div>
									{details?.dealer.region && (
										<div className={classes.infoRow}>
											<div className={classes.infoLabel}>Region</div>
											<Text className={classes.infoValue}>
												{details.dealer.region}
											</Text>
										</div>
									)}
									{details?.dealer.location && (
										<div className={classes.infoRow}>
											<div className={classes.infoLabel}>Location</div>
											<Text className={classes.infoValue}>
												{details.dealer.location}
											</Text>
										</div>
									)}
								</Stack>
							</Paper>
						</div>

						{/* Contact Information */}
						<div className={classes.infoSection}>
							<Text className={classes.sectionTitle}>Contact Information</Text>
							<Paper
								className={classes.infoCard}
								shadow="xs"
							>
								<Stack spacing="xs">
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>
											<IconUser size={16} />
											Contact Person
										</div>
										<Text className={classes.infoValue}>
											{details?.dealer.contactPerson || dealer.contactPerson}
										</Text>
									</div>
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>
											<IconMail size={16} />
											Email Address
										</div>
										<Group spacing="xs">
											<Text
												component="a"
												href={`mailto:${details?.dealer.email || dealer.email}`}
												className={classes.linkValue}
											>
												{details?.dealer.email || dealer.email}
											</Text>
											<Tooltip label="Open email client">
												<ActionIcon
													variant="subtle"
													size="xs"
													component="a"
													href={`mailto:${details?.dealer.email || dealer.email}`}
												>
													<IconExternalLink size={12} />
												</ActionIcon>
											</Tooltip>
										</Group>
									</div>
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>
											<IconPhone size={16} />
											Phone Number
										</div>
										<Group spacing="xs">
											<Text
												component="a"
												href={`tel:${details?.dealer.msisdn || dealer.phone}`}
												className={classes.linkValue}
											>
												{details?.dealer.msisdn || dealer.phone}
											</Text>
											<Tooltip label="Call number">
												<ActionIcon
													variant="subtle"
													size="xs"
													component="a"
													href={`tel:${details?.dealer.msisdn || dealer.phone}`}
												>
													<IconExternalLink size={12} />
												</ActionIcon>
											</Tooltip>
										</Group>
									</div>
								</Stack>
							</Paper>
						</div>

						{/* Business Details */}
						<div className={classes.infoSection}>
							<Text className={classes.sectionTitle}>Business Details</Text>
							<Paper
								className={classes.infoCard}
								shadow="xs"
							>
								<Stack spacing="xs">
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>
											<IconCalendar size={16} />
											Created Date
										</div>
										<Text className={classes.infoValue}>
											{formatDate(
												details?.dealer.createdAt || dealer.createdAt
											)}
										</Text>
									</div>
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>Dealer ID</div>
										<Group spacing="xs">
											<Text
												className={classes.infoValue}
												style={{ fontFamily: 'monospace' }}
											>
												{details?.dealer.id || dealer.id}
											</Text>
											<Tooltip label="Copy ID">
												<ActionIcon
													variant="subtle"
													size="xs"
													onClick={() => copyToClipboard(dealer.id)}
												>
													<IconCopy size={12} />
												</ActionIcon>
											</Tooltip>
										</Group>
									</div>
								</Stack>
							</Paper>
						</div>

						{/* Admins */}
						{details?.admins && (
							<div className={classes.infoSection}>
								<Text className={classes.sectionTitle}>Dealer Admins</Text>
								<Paper
									className={classes.infoCard}
									shadow="xs"
								>
									<Stack spacing="xs">
										{details.admins.map((a) => (
											<div
												key={a.id}
												className={classes.infoRow}
											>
												<div className={classes.infoLabel}>{a.name}</div>
												<Group spacing="xs">
													<Badge
														size="sm"
														variant="light"
													>
														{a.role.replace('_', ' ')}
													</Badge>
													<Badge
														size="sm"
														color={
															a.status === 'active' ? 'green' : 'red'
														}
													>
														{a.status}
													</Badge>
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
																icon={<IconUserEdit size={16} />}
																onClick={() => {
																	setSelectedAdmin(a);
																	openEditAdmin();
																}}
															>
																Edit
															</Menu.Item>
															{a.status === 'active' && (
																<Menu.Item
																	color="red"
																	icon={<IconPower size={16} />}
																	onClick={() =>
																		deactivateAdmin.mutate(a.id)
																	}
																>
																	Deactivate
																</Menu.Item>
															)}
														</Menu.Dropdown>
													</Menu>
												</Group>
											</div>
										))}
									</Stack>
								</Paper>
							</div>
						)}

						{/* Shops count */}
						{details?.shops && (
							<div className={classes.infoSection}>
								<Text className={classes.sectionTitle}>Shops</Text>
								<Paper
									className={classes.infoCard}
									shadow="xs"
								>
									<Text>Total shops: {details.shops.length}</Text>
								</Paper>
							</div>
						)}

						{selectedAdmin && (
							<EditDealerAdminModal
								opened={editAdminOpened}
								onClose={closeEditAdmin}
								dealerId={dealer.id}
								admin={selectedAdmin}
							/>
						)}

						{/* Stock summary */}
						{details?.stockSummary && (
							<div className={classes.infoSection}>
								<Text className={classes.sectionTitle}>Stock Summary</Text>
								<Paper
									className={classes.infoCard}
									shadow="xs"
								>
									<Stack spacing="xs">
										<Group position="apart">
											<Text>Total</Text>
											<Text weight={600}>
												{details.stockSummary.totalStock}
											</Text>
										</Group>
										<Group position="apart">
											<Text>Available</Text>
											<Text weight={600}>
												{details.stockSummary.availableStock}
											</Text>
										</Group>
										<Group position="apart">
											<Text>Sold</Text>
											<Text weight={600}>
												{details.stockSummary.soldStock}
											</Text>
										</Group>
									</Stack>
								</Paper>
							</div>
						)}
					</>
				)}
			</div>

			{/* Enhanced Actions */}
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
