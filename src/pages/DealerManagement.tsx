import { Tabs, Title, Text, Group, Container, createStyles, ThemeIcon, Badge } from '@mantine/core';
import {
	IconBox,
	IconBuildingStore,
	IconUserCircle,
	IconUsers,
	IconSettings,
} from '@tabler/icons-react';
import Layout from '../components/Layout';
import { DealerList } from '../modules/DealerManagement/DealerList';
import { ShopList } from '../modules/DealerManagement/ShopList';
import { ShopUsersList } from '../modules/DealerManagement/ShopUsersList';
import { StockList } from '../modules/DealerManagement/StockList';

const useStyles = createStyles((theme) => ({
	root: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		minHeight: '100vh',
		padding: theme.spacing.md,
	},

	header: {
		backgroundColor: theme.white,
		padding: theme.spacing.xl,
		borderRadius: theme.radius.lg,
		boxShadow: theme.shadows.sm,
		marginBottom: theme.spacing.lg,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
	},

	headerContent: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		gap: theme.spacing.md,
	},

	titleSection: {
		flex: 1,
	},

	statsGroup: {
		display: 'flex',
		gap: theme.spacing.md,
		flexWrap: 'wrap',
	},

	statCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		padding: theme.spacing.md,
		borderRadius: theme.radius.md,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		minWidth: 120,
		textAlign: 'center',
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: theme.shadows.md,
		},
	},

	contentCard: {
		backgroundColor: theme.white,
		borderRadius: theme.radius.lg,
		boxShadow: theme.shadows.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		overflow: 'hidden',
	},

	tabsList: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		padding: `0 ${theme.spacing.lg}`,
		position: 'sticky',
		top: 0,
		zIndex: 10,
	},

	tab: {
		padding: `${theme.spacing.md} ${theme.spacing.lg}`,
		fontWeight: 500,
		transition: 'all 0.2s ease',

		'&[data-active]': {
			backgroundColor: theme.colors.yellow[0],
			color: theme.colors.yellow[7],
			borderBottom: `2px solid ${theme.colors.yellow[6]}`,
		},

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
		},
	},

	tabPanel: {
		padding: theme.spacing.xl,
	},

	subtitle: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		marginTop: theme.spacing.xs,
	},
}));

export default function DealerManagement() {
	const { classes } = useStyles();

	return (
		<Layout>
			<div className={classes.root}>
				<Container
					size={1920}
					p={0}
				>
					{/* Enhanced Header */}
					<div className={classes.header}>
						<div className={classes.headerContent}>
							<div className={classes.titleSection}>
								<Group
									spacing="md"
									align="center"
								>
									<ThemeIcon
										size={48}
										radius="md"
										variant="light"
										color="yellow"
									>
										<IconSettings size={24} />
									</ThemeIcon>
									<div>
										<Title
											order={1}
											size="h2"
										>
											Dealer Management
										</Title>
										<Text
											className={classes.subtitle}
											size="sm"
										>
											Manage dealers, shops, users, and inventory across your
											network
										</Text>
									</div>
								</Group>
							</div>

							{/* Quick Stats */}
							<div className={classes.statsGroup}>
								<div className={classes.statCard}>
									<Badge
										color="yellow"
										variant="light"
										size="sm"
										mb="xs"
									>
										Active Dealers
									</Badge>
									<Text
										size="xl"
										weight={700}
										color="yellow"
									>
										24
									</Text>
								</div>
								<div className={classes.statCard}>
									<Badge
										color="green"
										variant="light"
										size="sm"
										mb="xs"
									>
										Total Shops
									</Badge>
									<Text
										size="xl"
										weight={700}
										color="green"
									>
										156
									</Text>
								</div>
								<div className={classes.statCard}>
									<Badge
										color="orange"
										variant="light"
										size="sm"
										mb="xs"
									>
										In Stock
									</Badge>
									<Text
										size="xl"
										weight={700}
										color="orange"
									>
										1,234
									</Text>
								</div>
							</div>
						</div>
					</div>

					{/* Enhanced Content Card */}
					<div className={classes.contentCard}>
						<Tabs
							defaultValue="dealers"
							variant="pills"
						>
							<Tabs.List className={classes.tabsList}>
								<Tabs.Tab
									value="dealers"
									icon={<IconUsers size={16} />}
									className={classes.tab}
								>
									Dealers
								</Tabs.Tab>
								<Tabs.Tab
									value="shops"
									icon={<IconBuildingStore size={16} />}
									className={classes.tab}
								>
									Shops
								</Tabs.Tab>
								<Tabs.Tab
									value="users"
									icon={<IconUserCircle size={16} />}
									className={classes.tab}
								>
									Shop Users
								</Tabs.Tab>
								<Tabs.Tab
									value="stock"
									icon={<IconBox size={16} />}
									className={classes.tab}
								>
									Stock Management
								</Tabs.Tab>
							</Tabs.List>

							<Tabs.Panel
								value="dealers"
								className={classes.tabPanel}
							>
								<DealerList />
							</Tabs.Panel>
							<Tabs.Panel
								value="shops"
								className={classes.tabPanel}
							>
								<ShopList />
							</Tabs.Panel>
							<Tabs.Panel
								value="users"
								className={classes.tabPanel}
							>
								<ShopUsersList shop={undefined} />
							</Tabs.Panel>
							<Tabs.Panel
								value="stock"
								className={classes.tabPanel}
							>
								<StockList />
							</Tabs.Panel>
						</Tabs>
					</div>
				</Container>
			</div>
		</Layout>
	);
}
