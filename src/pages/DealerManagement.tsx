import { Badge, createStyles, Group, Tabs, Text, ThemeIcon, Title } from '@mantine/core';
import {
	IconBox,
	IconBuildingStore,
	IconSettings,
	IconTransfer,
	IconUser,
	IconUserCircle,
	IconUsers,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import useRequest from '../hooks/useRequest';
import { AgentList } from '../modules/Agent/AgentList';
import { DealerList } from '../modules/Dealer/DealerList';
import { Dealer } from '../modules/Dealer/types';
import { ShopList } from '../modules/Shop/ShopList';
import { ShopUsersList } from '../modules/Shop/ShopUsersList';
import { StockList } from '../modules/Stock/StockList';
import { StockTransfersList } from '../modules/Stock/StockTransfersList';

const useStyles = createStyles((theme) => ({
	root: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		minHeight: '100vh',
	},

	header: {
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
	},

	contentCard: {
		borderRadius: theme.radius.lg,
		boxShadow: theme.shadows.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		overflow: 'hidden',
	},

	tabsList: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
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
	const request = useRequest(true);

	const { data: dealers } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/dealer'),
	});

	const { data: shops } = useQuery({
		queryKey: ['shops'],
		queryFn: () => request.get('/shops'),
	});

	const { data: agents } = useQuery({
		queryKey: ['agents'],
		queryFn: () => request.get('/agents'),
	});

	const { data: stock } = useQuery({
		queryKey: ['stock'],
		queryFn: () => request.get('/stock'),
	});

	console.log(agents);

	const totalActiveDealers = dealers?.data?.data?.filter(
		(dealer: Dealer) => dealer.status.toLowerCase() === 'active'
	).length;

	const totalShops = shops?.data?.totalCount;
	const totalAgents = agents?.data?.totalCount;

	const totalStock = stock?.data?.totalCount;

	return (
		<Layout>
			<div className={classes.root}>
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
									{totalActiveDealers}
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
									{totalShops}
								</Text>
							</div>
							<div className={classes.statCard}>
								<Badge
									color="orange"
									variant="light"
									size="sm"
									mb="xs"
								>
									Total Agents
								</Badge>
								<Text
									size="xl"
									weight={700}
									color="orange"
								>
									{totalAgents}
								</Text>
							</div>
							<div className={classes.statCard}>
								<Badge
									color="purple"
									variant="light"
									size="sm"
									mb="xs"
								>
									In Stock
								</Badge>
								<Text
									size="xl"
									weight={700}
									color="purple"
								>
									{totalStock}
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
								value="agents"
								icon={<IconUser size={16} />}
								className={classes.tab}
							>
								Agent Management
							</Tabs.Tab>
							<Tabs.Tab
								value="stock"
								icon={<IconBox size={16} />}
								className={classes.tab}
							>
								Stock Management
							</Tabs.Tab>
							<Tabs.Tab
								value="stock-transfers"
								icon={<IconTransfer size={16} />}
								className={classes.tab}
							>
								Stock Transfers
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
							value="agents"
							className={classes.tabPanel}
						>
							<AgentList />
						</Tabs.Panel>
						<Tabs.Panel
							value="stock"
							className={classes.tabPanel}
						>
							<StockList />
						</Tabs.Panel>
						<Tabs.Panel
							value="stock-transfers"
							className={classes.tabPanel}
						>
							<StockTransfersList />
						</Tabs.Panel>
					</Tabs>
				</div>
			</div>
		</Layout>
	);
}
