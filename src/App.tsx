import { useRoutes } from 'react-router-dom'
import { Loadable } from './hocs/loadable'
import { lazy } from 'react'
import { ROUTES } from './constants/routes'

const Signin = Loadable(lazy(() => import('./pages/signin')))
const Dashboard = Loadable(lazy(() => import('./pages/dashboard')))
const NotFound = Loadable(lazy(() => import('./pages/404')))
const PasswordReset = Loadable(lazy(() => import('./pages/password-reset')))

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
	])
}
