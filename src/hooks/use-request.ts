import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { notifications } from '@mantine/notifications';

export default function useRequest(): AxiosInstance {
	const token = useSelector( ( state: RootState ) => state.auth.token );

	const notRequireAuthorizationEndpoints = [
		"/onboard-activation",
		"/balance-check",
		"/balance-detail",
		"/activation-response",
		"/login",
		"/request-otp",
		"/password-reset",
	];
	const requireAuthorizationEndpoints = [
		"/bundle-activations",
		"/customer-details",
		"/customers",
		"/load-bundle",
		"/activations",
		"/wakanet-activation",
		"/reject-activations",
	];

	const instance = axios.create( {
		baseURL: import.meta.env.VITE_APP_BASE_URL!,
	} );

	instance.interceptors.request.use(
		( config ) => {
			const { url } = config;

			if ( url ) {
				if ( notRequireAuthorizationEndpoints.includes( url ) ) {
					return config;
				}

				if ( requireAuthorizationEndpoints.includes( url ) ) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			}

			return config;
		},
		( error ) => {
			return Promise.reject( error );
		}
	);

	instance.interceptors.response.use(
		( response: AxiosResponse ) => {
			notifications.show( {
				autoClose: 60000,
				// title: "SUCCESS :: " + response.data?.message,
				// @ts-ignore
				message: response?.data.message,
				color: "green",
			} );
			return response;
		},
		( error ) => {
			if ( error.response ) {
				notifications.show( {
					autoClose: 60000,
					// title: "Error status :: " + error.response.status,
					// @ts-ignore
					message: error.response?.data.message,
					color: 'red',
				} );
			} else if ( error.request ) {
				notifications.show( {
					autoClose: 60000,
					title: "Error status :: " + error.response.status,
					// @ts-ignore
					message: 'Request was made, No response received',
					color: 'red',
				} );
				console.error( 'Request was made, No response received' );
			} else {
				notifications.show( {
					autoClose: 60000,
					title: "Error status :: " + error.response.status,
					// @ts-ignore
					message: 'Error setting up the request:: ' + error.message,
					color: 'red',
				} );
			}

			// handle specific error cases here (e.g., token expiration, redirect to login, etc.)
			return Promise.reject( error );
		}
	);

	return instance;
}
