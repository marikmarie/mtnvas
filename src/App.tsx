import { useRoutes } from 'react-router-dom'
import { PublicLoader as Loader } from './hocs/loadable'
import { lazy } from 'react'

const Signin = Loader(lazy(() => import('./pages/signin')))
const Dashboard = Loader(lazy(() => import('./pages/dashboard')))
const NotFound = Loader(lazy(() => import('./pages/404')))
const RequestOtp = Loader(lazy(() => import('./pages/otp/request-otp')))

export default function AppRouter() {
	return useRoutes([
		{
			path: '/',
			element: <Signin />,
		},
		{
			path: '/otp/request',
			element: <RequestOtp />,
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
