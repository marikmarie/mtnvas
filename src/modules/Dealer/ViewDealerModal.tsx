import {
	ActionIcon,
	Badge,
	Button,
	createStyles,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
	Tooltip,
} from '@mantine/core';
import {
	IconBuilding,
	IconCalendar,
	IconCopy,
	IconExternalLink,
	IconEye,
	IconMail,
	IconPhone,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import { Dealer } from './types';

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

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
		>
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

			<div className={classes.content}>
				<>
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
									<Text className={classes.infoValue}>{dealer.dealerName}</Text>
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
								{dealer.region && (
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>Region</div>
										<Text className={classes.infoValue}>{dealer.region}</Text>
									</div>
								)}
								{dealer.location && (
									<div className={classes.infoRow}>
										<div className={classes.infoLabel}>Location</div>
										<Text className={classes.infoValue}>{dealer.location}</Text>
									</div>
								)}
							</Stack>
						</Paper>
					</div>

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
										Department
									</div>
									<Text>{dealer.department}</Text>
								</div>
								<div className={classes.infoRow}>
									<div className={classes.infoLabel}>
										<IconMail size={16} />
										Email
									</div>
									<Group spacing="xs">
										<Text
											component="a"
											href={`mailto:${dealer.email}`}
											className={classes.linkValue}
										>
											{dealer.email}
										</Text>
										<Tooltip label="Open email client">
											<ActionIcon
												variant="subtle"
												size="xs"
												component="a"
												href={`mailto:${dealer.email}`}
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
											href={`tel:${dealer.msisdn}`}
											className={classes.linkValue}
										>
											{dealer.msisdn}
										</Text>
										<Tooltip label="Call number">
											<ActionIcon
												variant="subtle"
												size="xs"
												component="a"
												href={`tel:${dealer.msisdn}`}
											>
												<IconExternalLink size={12} />
											</ActionIcon>
										</Tooltip>
									</Group>
								</div>
							</Stack>
						</Paper>
					</div>

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
										{formatDate(dealer.createdAt)}
									</Text>
								</div>
								<div className={classes.infoRow}>
									<div className={classes.infoLabel}>Dealer ID</div>
									<Group spacing="xs">
										<Text
											className={classes.infoValue}
											style={{ fontFamily: 'monospace' }}
										>
											{dealer.id}
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

					{/* {dealer.shops && (
						<div className={classes.infoSection}>
							<Text className={classes.sectionTitle}>Shops</Text>
							<Paper
								className={classes.infoCard}
								shadow="xs"
							>
								<Text>Total shops: {dealer.shops.length}</Text>
							</Paper>
						</div>
					)} */}

					{/* {dealer.stockSummary && (
						<div className={classes.infoSection}>
							<Text className={classes.sectionTitle}>Stock Summary</Text>
							<Paper
								className={classes.infoCard}
								shadow="xs"
							>
								<Stack spacing="xs">
									<Group position="apart">
										<Text>Total</Text>
										<Text weight={600}>{dealer.stockSummary.totalStock}</Text>
									</Group>
									<Group position="apart">
										<Text>Available</Text>
										<Text weight={600}>
											{dealer.stockSummary.availableStock}
										</Text>
									</Group>
									<Group position="apart">
										<Text>Sold</Text>
										<Text weight={600}>{dealer.stockSummary.soldStock}</Text>
									</Group>
								</Stack>
							</Paper>
						</div>
					)} */}
				</>
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
