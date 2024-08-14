import axios, { AxiosInstance, AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { __prod__ } from '../utils/__prod__';

const BASE_URL = __prod__
	? import.meta.env.VITE_APP_BASE_URL_PROD
	: import.meta.env.VITE_APP_BASE_URL_DEV;

export default function useRequest(requireAuth: boolean = false): AxiosInstance {
	const token = useSelector((state: RootState) => state.auth.token);

	const instance = axios.create({
		baseURL: BASE_URL,
		headers: requireAuth ? { Authorization: `Bearer ${token}` } : {},
	});

	instance.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			let title = 'Error';
			let message = 'An unexpected error occurred';

			if (error.response) {
				title = `Error ${error.response.status}`;
				// @ts-ignore
				message = error.response.data?.message || 'An error occurred with the response';
			} else if (error.request) {
				message = 'No response received from the server';
			} else {
				message = `Error setting up the request: ${error.message}`;
			}

			notifications.show({
				title,
				message,
				color: 'red',
				autoClose: 5000,
			});

			return Promise.reject(error);
		}
	);

	return instance;
}
