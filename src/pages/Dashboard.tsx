import {
	IconCircleCheck,
	IconDeviceMobile,
	IconEdit,
	IconLoader,
	IconNews,
	IconReport,
	IconRouter,
} from '@tabler/icons-react';
import React, { lazy } from 'react';
import Layout from '../components/Layout';
import { Loadable } from '../hocs/loadable';
import { withAuth } from '../hocs/WithAuth';
import { WakanetActivation } from '../modules/WakanetActivation';

const StarterPack = Loadable(lazy(() => import('../modules/5GStarterPack')));

const LazyComponents = {
	Signup: Loadable(lazy(() => import('../modules/5GStarterPack'))),
	LoadBundle: Loadable(lazy(() => import('../modules/LoadBundle'))),
	CheckBalance: Loadable(lazy(() => import('../modules/CheckBalance'))),
	UpdateDetails: Loadable(lazy(() => import('../modules/UpdateDetails'))),
	ActivationsReport: Loadable(lazy(() => import('../modules/Reports/ActivationsReport'))),
	RenewalsReport: Loadable(lazy(() => import('../modules/Reports/RenewalsReport'))),
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
		label: '4G/5G Router Starterpack - Online payments',
		component: LazyComponents.Signup,
		showForOfficeUser: true,
		icon: <IconDeviceMobile size={20} />,
	},
	{
		key: 'wakanet-activation',
		label: '4G/5G Router Starterpack - Cash payments',
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
		label: 'StarterPack Activation Report',
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

const Dashboard: React.FC = () => {
	return (
		<Layout>
			<StarterPack />
		</Layout>
	);
};

export default React.memo(withAuth(Dashboard));
