import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
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
	const token = useSelector((state: RootState) => state.auth.token);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		showSuccess = true,
		showError = true,
		successColor = 'green',
		errorColor = 'red',
		autoClose = 5000,
	} = notificationOptions;

	function logout() {
		dispatch(signout());
		navigate('/signin');
	}

	const instance = axios.create({
		baseURL: BASE_URL,
		headers: requireAuth ? { Authorization: `Bearer ${token}` } : {},
	});

	const showNotification = (message: string, color: string) => {
		if (!message || message.toLowerCase().trim() === 'success') return;

		const toastOptions = {
			duration: autoClose,
		};

		if (color === 'green' || color === 'success') {
			toast.success(message, toastOptions);
		} else if (color === 'red' || color === 'error') {
			toast.error(message, toastOptions);
		} else if (color === 'yellow' || color === 'warning') {
			toast(message, { ...toastOptions, icon: '⚠️' });
		} else {
			toast(message, toastOptions);
		}
	};

	instance.interceptors.response.use(
		(response: AxiosResponse<ApiResponse>) => {
			const responseMessage = String(
				response?.data?.status ||
					response?.data?.message ||
					JSON.stringify(response?.data).replace(/"/g, '')
			);
			if (response.data.status === 401) {
				logout();
				if (response.data.message) {
					showNotification(responseMessage, 'yellow');
				}
			}

			if (showSuccess && response.data.message) {
				showNotification(response.data.message, successColor);
			}

			return response;
		},
		(error: AxiosError<ApiResponse>) => {
			if (!showError) return Promise.reject(error);

			const errorMessage = String(
				error.response?.data?.message ||
					error.response?.data ||
					error.message ||
					error.response?.data?.status
			);

			if (error.response) {
				showNotification(errorMessage, errorColor);
			}

			return Promise.reject(error);
		}
	);

	return instance;
}
