import { createStyles, Group, Paper, Tabs, Text, Title } from '@mantine/core';
import { IconCash, IconPercentage } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Layout from '../components/Layout';
import useRequest from '../hooks/useRequest';
import { CommissionEarnings, CommissionRates } from '../modules/Commission';

const useStyles = createStyles((theme) => ({
	root: {
		minHeight: '100vh',
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
	},

	header: {
		marginBottom: theme.spacing.md,
		padding: theme.spacing.md,
		borderRadius: theme.radius.lg,
		background:
			theme.colorScheme === 'dark'
				? `linear-gradient(135deg, ${theme.colors.dark[6]} 0%, ${theme.colors.dark[7]} 100%)`
				: `linear-gradient(135deg, ${theme.white} 0%, ${theme.colors.gray[0]} 100%)`,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		boxShadow: theme.shadows.sm,
	},

	headerContent: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		gap: theme.spacing.md,
		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
			alignItems: 'stretch',
		},
	},

	titleSection: {
		flex: 1,
	},

	statsSection: {
		display: 'flex',
		gap: theme.spacing.lg,
		[theme.fn.smallerThan('sm')]: {
			flexDirection: 'column',
			width: '100%',
		},
	},

	statCard: {
		padding: theme.spacing.sm,
		borderRadius: theme.radius.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		minWidth: 120,
		textAlign: 'center',
	},

	statValue: {
		fontSize: '1.5rem',
		fontWeight: 700,
		color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[9],
		marginBottom: 4,
	},

	statLabel: {
		fontSize: theme.fontSizes.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		fontWeight: 500,
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
	},

	tabsContainer: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		borderRadius: theme.radius.lg,
		overflow: 'hidden',
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		boxShadow: theme.shadows.sm,
	},

	tabsList: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	tab: {
		padding: `${theme.spacing.md} ${theme.spacing.lg}`,
		borderRadius: theme.radius.md,
		fontWeight: 500,
		'&[data-active]': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.yellow[9] : theme.colors.yellow[0],
			color: theme.colorScheme === 'dark' ? theme.colors.yellow[2] : theme.colors.yellow[7],
		},
	},

	tabContent: {
		padding: 0,
	},
}));

export default function CommissionManagement() {
	const { classes } = useStyles();
	const [activeTab, setActiveTab] = useState<string>('rates');
	const request = useRequest(true);

	const {
		data: commissionSummary,
		isLoading: summaryLoading,
		error: summaryError,
	} = useQuery({
		queryKey: ['commission-summary'],
		queryFn: async () => {
			try {
				const earningsResponse = await request.get('/commissions/earnings');

				const totalEarned = earningsResponse.data?.summary?.totalEarned;
				const totalPending = earningsResponse.data?.summary?.totalPending;
				const totalPaid = earningsResponse.data?.summary?.totalPaid;

				return {
					totalEarned,
					totalPending,
					totalPaid,
				};
			} catch (error) {
				console.error('Failed to fetch commission summary:', error);
				return {
					totalEarned: 0,
					totalPending: 0,
					totalPaid: 0,
				};
			}
		},
	});

	console.log(commissionSummary);

	return (
		<Layout>
			<Paper className={classes.header}>
				<div className={classes.headerContent}>
					<div className={classes.titleSection}>
						<Group
							spacing="md"
							mb="sm"
						>
							<IconPercentage
								size={28}
								color="#4DABF7"
							/>
							<div>
								<Title
									order={2}
									mb={4}
								>
									Commission Management
								</Title>
								<Text
									color="dimmed"
									size="sm"
								>
									Manage commission rates and track agent earnings
								</Text>
							</div>
						</Group>
					</div>

					<div className={classes.statsSection}>
						{summaryError ? (
							<Paper className={classes.statCard}>
								<Text
									className={classes.statValue}
									color="red"
								>
									Error
								</Text>
								<Text className={classes.statLabel}>Failed to load data</Text>
							</Paper>
						) : summaryLoading ? (
							<>
								<Paper className={classes.statCard}>
									<Text className={classes.statValue}>...</Text>
									<Text className={classes.statLabel}>Loading...</Text>
								</Paper>
								<Paper className={classes.statCard}>
									<Text className={classes.statValue}>...</Text>
									<Text className={classes.statLabel}>Loading...</Text>
								</Paper>
								<Paper className={classes.statCard}>
									<Text className={classes.statValue}>...</Text>
									<Text className={classes.statLabel}>Loading...</Text>
								</Paper>
								<Paper className={classes.statCard}>
									<Text className={classes.statValue}>...</Text>
									<Text className={classes.statLabel}>Loading...</Text>
								</Paper>
							</>
						) : (
							<>
								<Paper className={classes.statCard}>
									<Text className={classes.statValue}>
										{commissionSummary?.totalEarned / 1000000}M
									</Text>
									<Text className={classes.statLabel}>Total Earnings</Text>
								</Paper>

								<Paper className={classes.statCard}>
									<Text className={classes.statValue}>
										{commissionSummary?.totalPending / 1000000}M
									</Text>
									<Text className={classes.statLabel}>Pending</Text>
								</Paper>

								<Paper className={classes.statCard}>
									<Text className={classes.statValue}>
										{commissionSummary?.totalPaid / 1000000}M
									</Text>
									<Text className={classes.statLabel}>Paid</Text>
								</Paper>
							</>
						)}
					</div>
				</div>
			</Paper>

			<Tabs
				value={activeTab}
				onTabChange={(value) => {
					if (value) {
						setActiveTab(value as string);
					}
				}}
				classNames={{
					root: classes.tabsContainer,
					tabsList: classes.tabsList,
					tab: classes.tab,
					panel: classes.tabContent,
				}}
			>
				<Tabs.List>
					<Tabs.Tab
						value="rates"
						icon={<IconPercentage size={16} />}
					>
						Commission Rates
					</Tabs.Tab>
					<Tabs.Tab
						value="earnings"
						icon={<IconCash size={16} />}
					>
						Commission Earnings
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="rates">
					<CommissionRates />
				</Tabs.Panel>

				<Tabs.Panel value="earnings">
					<CommissionEarnings />
				</Tabs.Panel>
			</Tabs>
		</Layout>
	);
}
