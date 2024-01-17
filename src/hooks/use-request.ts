
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export default function useRequest(): AxiosInstance {
	const token = useSelector( ( state: RootState ) => state.auth.token );

	const instance = location.pathname === "/"
		? axios.create( {
			baseURL: import.meta.env.VITE_APP_BASE_URL!,
			headers: {
				'Content-Type': 'application/json',
			},
		} )
		: axios.create( {
			baseURL: import.meta.env.VITE_APP_BASE_URL!,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		} );

	instance.interceptors.request.use(
		( config: InternalAxiosRequestConfig<any> ) => {
			return config;
		},
		( error ) => {
			return Promise.reject( error );
		}
	);
	instance.interceptors.response.use(
		( response: AxiosResponse ) => {
			return response;
		},
		( error ) => {
			if ( error.response ) {
				console.error( 'Response error status:', error.response.status );
			} else if ( error.request ) {
				console.error( 'Request was made, No response received' );
			} else {
				console.error( 'Error setting up the request', error.message );
			}

			// handle specific error cases here (e.g., token expiration, redirect to login, etc.)
			return Promise.reject( error );
		}
	);

	return instance;
}
