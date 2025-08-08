import { notifications } from '@mantine/notifications';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signout } from '../app/slices/auth';
import { RootState } from '../app/store';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

interface NotificationOptions {
	showSuccess?: boolean;
	showError?: boolean;
	successColor?: string;
	errorColor?: string;
	autoClose?: number;
	title?: string;
}

interface ApiResponse {
	status?: number;
	message?: string;
	[key: string]: any;
}

export default function useRequest(
	requireAuth: boolean = false,
	notificationOptions: NotificationOptions = {}
): AxiosInstance {
	const token = useSelector( ( state: RootState ) => state.auth.token );
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		showSuccess = true,
		showError = true,
		successColor = 'green',
		errorColor = 'red',
		autoClose = 5000,
		title = 'Notification',
	} = notificationOptions;

	function logout() {
		dispatch( signout() );
		navigate( '/signin' );
	}

	const instance = axios.create( {
		baseURL: BASE_URL,
		headers: requireAuth ? { Authorization: `Bearer ${token}` } : {},
	} );

	const showNotification = ( message: string, color: string, customTitle?: string ) => {
		if ( !message || message.toLowerCase().trim() === "success" ) return;
		return;
		notifications.show( {
			title: customTitle || title,
			message:
				typeof message === 'string' ? message : JSON.stringify( message ).replace( /"/g, '' ),
			color,
			autoClose,
		} );
	};

	instance.interceptors.response.use(
		( response: AxiosResponse<ApiResponse> ) => {
			const responseMessage = String(
				response?.data?.status ||
				response?.data?.message ||
				response?.data ||
				// @ts-ignore
				response.message
			);
			if ( response.data.status === 401 ) {
				logout();
				if ( response.data.message ) {
					showNotification( responseMessage, 'yellow', 'Authentication Error' );
				}
			}

			if ( showSuccess && response.data.message ) {
				showNotification( response.data.message, successColor );
			}

			return response;
		},
		( error: AxiosError<ApiResponse> ) => {
			if ( !showError ) return Promise.reject( error );

			const errorMessage = String(
				error.response?.data?.status ||
				error.response?.data?.message ||
				error.response?.data ||
				error.message
			);

			if ( error.response ) {
				showNotification( errorMessage, errorColor, 'Error' );
			}

			return Promise.reject( error );
		}
	);

	return instance;
}
