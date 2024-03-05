import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { notifications } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export default function useRequest( requireAuth: boolean ): AxiosInstance {
	const token = useSelector( ( state: RootState ) => state.auth.token );

	const instance = !requireAuth ? axios.create( {
		baseURL: import.meta.env.VITE_APP_BASE_URL!,
	} ) : axios.create( {
		baseURL: import.meta.env.VITE_APP_BASE_URL!,
		headers: {
			Authorization: `Bearer ${token}`
		}
	} )

	instance.interceptors.request.use(
		( config ) => {
			return config;
		},
		( error ) => {
			return Promise.reject( error );
		}
	);

	instance.interceptors.response.use(
		( response: AxiosResponse ) => {
			notifications.show( {
				title: "Success",
				autoClose: 15000,
				message: response?.data.message,
				color: "green",
			} );
			return response;
		},
		( error ) => {
			if ( error.response ) {
				notifications.show( {
					title: "Error",
					autoClose: 15000,
					message: error.response?.data.message,
					color: 'red',
				} );
			} else if ( error.request ) {
				notifications.show( {
					autoClose: 15000,
					title: "Error status :: " + error.response.status,
					message: 'Request was made, No response received',
					color: 'red',
				} );
			} else {
				notifications.show( {
					autoClose: 15000,
					title: "Error status :: " + error.response.status,
					message: 'Error setting up the request:: ' + error.message,
					color: 'red',
				} );
			}
			return Promise.reject( error );
		}
	);

	return instance;
}
