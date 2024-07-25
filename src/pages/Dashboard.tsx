import React, { useState, useCallback, lazy } from 'react';
import { createStyles, Paper, SimpleGrid, Stack } from '@mantine/core';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/With-Auth';
import { Loadable } from '../hocs/Loadable';
import { RootState } from '../app/store';
import { WakanetActivation } from '../modules/WakanetActivation';
import {
	IconDeviceMobile,
	IconRouter,
	IconEdit,
	IconReport,
	IconNews,
	IconCircleCheck,
	IconLoader,
} from '@tabler/icons-react';

// Lazy-loaded components
const LazyComponents = {
	Signup: Loadable(lazy(() => import('../modules/5GStarterPack'))),
	LoadBundle: Loadable(lazy(() => import('../modules/LoadBundle'))),
	CheckBalance: Loadable(lazy(() => import('../modules/CheckBalance'))),
	UpdateDetails: Loadable(lazy(() => import('../modules/UpdateDetails'))),
	ActivationsReport: Loadable(lazy(() => import('../modules/Reports/Activations'))),
	RenewalsReport: Loadable(lazy(() => import('../modules/Reports/Renewals'))),
};

type Tab =
	| 'signup'
	| 'load-bundle'
	| 'check-balance'
	| 'update-details'
	| 'activations-report'
	| 'renewals-report'
	| 'wakanet-activation';

interface TabConfig {
	key: Tab;
	label: string;
	component: React.ComponentType;
	showForOfficeUser: boolean;
	icon: React.ReactNode;
}

const tabConfigs: TabConfig[] = [
	{
		key: 'signup',
		label: '4G/5G Starterpack',
		component: LazyComponents.Signup,
		showForOfficeUser: true,
		icon: <IconDeviceMobile size={20} />,
	},
	{
		key: 'wakanet-activation',
		label: 'WakaNet Router Starterpack',
		component: WakanetActivation,
		showForOfficeUser: false,
		icon: <IconRouter size={20} />,
	},
	{
		key: 'load-bundle',
		label: 'Load Bundle',
		component: LazyComponents.LoadBundle,
		showForOfficeUser: false,
		icon: <IconLoader size={20} />,
	},
	{
		key: 'check-balance',
		label: 'Check Balance',
		component: LazyComponents.CheckBalance,
		showForOfficeUser: true,
		icon: <IconCircleCheck size={20} />,
	},
	{
		key: 'update-details',
		label: 'Update Details',
		component: LazyComponents.UpdateDetails,
		showForOfficeUser: false,
		icon: <IconEdit size={20} />,
	},
	{
		key: 'activations-report',
		label: 'Activations Report',
		component: LazyComponents.ActivationsReport,
		showForOfficeUser: true,
		icon: <IconReport size={20} />,
	},
	{
		key: 'renewals-report',
		label: 'Renewals Report',
		component: LazyComponents.RenewalsReport,
		showForOfficeUser: true,
		icon: <IconNews size={20} />,
	},
];

const useStyles = createStyles(() => ({
	root: {
		position: 'static',
		zIndex: 9,
	},
}));

const Dashboard: React.FC = () => {
	const [activeTab, setActiveTab] = useState<Tab>('signup');
	const user = useSelector((state: RootState) => state.auth.user);
	const isOfficeUser = user?.category === 'office';

	const onTabSwitch = useCallback((tab: Tab) => {
		setActiveTab(tab);
	}, []);

	const { classes } = useStyles();

	const renderTabs = () => (
		<SimpleGrid
			mt="sm"
			className={classes.root}
			cols={isOfficeUser ? 3 : 7}
			breakpoints={[
				{ maxWidth: 'md', cols: 2 },
				{ maxWidth: 'xs', cols: 2 },
				{ maxWidth: 'sm', cols: 2 },
			]}
		>
			{tabConfigs.map(
				({ key, label, icon, showForOfficeUser }) =>
					(!isOfficeUser || showForOfficeUser) && (
						<Paper
							key={key}
							withBorder
							p="sm"
							sx={{ cursor: 'pointer' }}
							bg={activeTab === key ? 'yellow' : 'white'}
							c={activeTab === key ? 'white' : 'dark'}
							onClick={() => onTabSwitch(key)}
							radius="md"
						>
							<Stack
								align="center"
								spacing="xs"
								fw={'bold'}
							>
								{icon}
								{label}
							</Stack>
						</Paper>
					)
			)}
		</SimpleGrid>
	);

	const ActiveComponent = tabConfigs.find((config) => config.key === activeTab)?.component;

	return (
		<Layout>
			{renderTabs()}
			{ActiveComponent && <ActiveComponent />}
		</Layout>
	);
};

export default React.memo(withAuth(Dashboard));
