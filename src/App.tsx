import { useRoutes } from 'react-router-dom'
import { PublicLoader as Loader } from './hocs/loadable'
import { lazy } from 'react'

const Signin = Loader(lazy(() => import('./pages/signin')))
const Dashboard = Loader(lazy(() => import('./pages/dashboard')))
const NotFound = Loader(lazy(() => import('./pages/404')))
const PasswordReset = Loader(lazy(() => import('./pages/password-reset')))

export default function AppRouter() {
	return useRoutes([
		{
			path: '/',
			element: <Signin />,
		},
		{
			path: '/password-reset',
			element: <PasswordReset />,
		},
		{
			path: '/dashboard',
			element: <Dashboard />,
		},
		{
			path: '*',
			element: <NotFound />,
		},
	])
}
