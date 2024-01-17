import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../app/store'
import React from 'react'

export const withAuth = <P extends object>(ProtectedComponent: React.FC<P>) => {
	const ComponentWithAuth: React.FC<P> = props => {
		const token = useSelector((state: RootState) => state.auth.token)

		const isAuthenticated = token ? true : false
		const location = useLocation()

		return isAuthenticated ? (
			<ProtectedComponent {...props} />
		) : (
			<Navigate to={'/'} state={{ from: location }} replace />
		)
	}
	return ComponentWithAuth
}
