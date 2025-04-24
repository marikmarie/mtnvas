import { useRoutes } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from './constants/routes';
import { Loadable } from './hocs/Loadable';

const Signin = Loadable(lazy(() => import('./pages/Signin')));
const Dashboard = Loadable(lazy(() => import('./pages/Dashboard')));
const NotFound = Loadable(lazy(() => import('./pages/404')));
const PasswordReset = Loadable(lazy(() => import('./pages/PasswordReset')));

const WakanetActivation = Loadable(lazy(() => import('./pages/WakanetActivation')));
const LoadBundle = Loadable(lazy(() => import('./pages/LoadBundle')));
const CheckBalance = Loadable(lazy(() => import('./pages/CheckBalance')));
const UpdateDetails = Loadable(lazy(() => import('./pages/UpdateDetails')));
const ActivationsReport = Loadable(lazy(() => import('./pages/ActivationsReport')));
const RenewalsReport = Loadable(lazy(() => import('./pages/RenewalsReport')));
const DealerManagement = Loadable(lazy(() => import('./pages/DealerManagement')));
const AddDealer = Loadable(lazy(() => import('./pages/AddDealer')));
const UpdateDealer = Loadable(lazy(() => import('./pages/UpdateDealer')));

export default function AppRouter() {
	return useRoutes([
		{
			path: ROUTES.AUTH,
			element: <Signin />,
		},
		{
			path: ROUTES.PASSWORD_RESET,
			element: <PasswordReset />,
		},
		{
			path: ROUTES.DASHBOARD,
			element: <Dashboard />,
		},
		{
			path: ROUTES.SIGNUP,
			element: <Dashboard />,
		},
		{
			path: ROUTES.WAKANET_ACTIVATION,
			element: <WakanetActivation />,
		},
		{
			path: ROUTES.LOAD_BUNDLE,
			element: <LoadBundle />,
		},
		{
			path: ROUTES.CHECK_BALANCE,
			element: <CheckBalance />,
		},
		{
			path: ROUTES.UPDATE_DETAILS,
			element: <UpdateDetails />,
		},
		{
			path: ROUTES.ACTIVATIONS_REPORT,
			element: <ActivationsReport />,
		},
		{
			path: ROUTES.RENEWALS_REPORT,
			element: <RenewalsReport />,
		},
		{
			path: ROUTES.DEALER_MANAGEMENT.ROOT,
			children: [
				{
					path: '',
					element: <DealerManagement />,
				},
				{
					path: 'add',
					element: <AddDealer />,
				},
				{
					path: 'edit/:id',
					element: <UpdateDealer />,
				},
			],
		},
		{
			path: ROUTES.ALL,
			element: <NotFound />,
		},
	]);
}
