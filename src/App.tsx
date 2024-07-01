import { useRoutes } from 'react-router-dom';
import { Loadable } from './hocs/loadable';
import { lazy } from 'react';
import { ROUTES } from './constants/routes';

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
			path: ROUTES.DASHRBOARD,
			element: <Dashboard />,
		},
		{
			path: ROUTES.ALL,
			element: <NotFound />,
		},
	]);
}
