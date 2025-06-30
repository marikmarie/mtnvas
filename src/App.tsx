import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { Loadable } from './hocs/loadable';

const Signin = Loadable(lazy(() => import('./pages/Signin')));
const Dashboard = Loadable(lazy(() => import('./pages/Dashboard')));
const NotFound = Loadable(lazy(() => import('./pages/404')));
const PasswordReset = Loadable(lazy(() => import('./pages/PasswordReset')));
const Signup = Loadable(lazy(() => import('./pages/Signup')));
const WakanetActivation = Loadable(lazy(() => import('./pages/WakanetActivation')));
const LoadBundle = Loadable(lazy(() => import('./pages/LoadBundle')));
const CheckBalance = Loadable(lazy(() => import('./pages/CheckBalance')));
const UpdateDetails = Loadable(lazy(() => import('./pages/UpdateDetails')));
const ActivationsReport = Loadable(lazy(() => import('./pages/ActivationsReport')));
const RenewalsReport = Loadable(lazy(() => import('./pages/RenewalsReport')));
const DealerManagement = Loadable(lazy(() => import('./pages/DealerManagement')));
const ImeiListPage = Loadable(lazy(() => import('./pages/ImeiList')));

export default function AppRouter() {
	return useRoutes([
		{
			path: '/signin',
			element: <Signin />,
		},
		{
			path: '/passwordReset',
			element: <PasswordReset />,
		},
		{
			path: '/',
			element: <Dashboard />,
		},
		{
			path: '/signup',
			element: <Signup />,
		},
		{
			path: '/wakanet-activation',
			element: <WakanetActivation />,
		},
		{
			path: '/load-bundle',
			element: <LoadBundle />,
		},
		{
			path: '/check-balance',
			element: <CheckBalance />,
		},
		{
			path: '/update-details',
			element: <UpdateDetails />,
		},
		{
			path: '/activations-report',
			element: <ActivationsReport />,
		},
		{
			path: '/renewals-report',
			element: <RenewalsReport />,
		},
		{
			path: '/dealer-management',
			element: <DealerManagement />,
		},
		{
			path: '/imei-list',
			element: <ImeiListPage />,
		},
		{
			path: '*',
			element: <NotFound />,
		},
	]);
}
