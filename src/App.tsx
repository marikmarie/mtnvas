import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { Loadable } from './hocs/loadable';

const Signin = Loadable(lazy(() => import('./pages/Signin')));
const Dashboard = Loadable(lazy(() => import('./pages/Dashboard')));
const NotFound = Loadable(lazy(() => import('./pages/404')));
const PasswordReset = Loadable(lazy(() => import('./pages/PasswordReset')));

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
			path: ROUTES.ALL,
			element: <NotFound />,
		},
	]);
}
