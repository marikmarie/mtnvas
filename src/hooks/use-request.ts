import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { notifications } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { __prod__ } from '../utils/__prod__';

export default function useRequest(requireAuth: boolean): AxiosInstance {
	const token = useSelector((state: RootState) => state.auth.token);

	const instance = !requireAuth
		? axios.create({
				baseURL: __prod__
					? import.meta.env.VITE_APP_BASE_URL_PROD!
					: import.meta.env.VITE_APP_BASE_URL_DEV!,
			})
		: axios.create({
				baseURL: __prod__
					? import.meta.env.VITE_APP_BASE_URL_PROD!
					: import.meta.env.VITE_APP_BASE_URL_DEV!,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

	instance.interceptors.request.use(
		(config) => {
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		(response: AxiosResponse) => {
			return response;
		},
		(error) => {
			if (error.response) {
				notifications.show({
					title: 'Error',
					autoClose: 5000,
					message: error.response?.data.message,
					color: 'red',
				});
			} else if (error.request) {
				notifications.show({
					autoClose: 5000,
					title: 'Error status :: ' + error.response.status,
					message: 'Request was made, No response received',
					color: 'red',
				});
			} else {
				notifications.show({
					autoClose: 5000,
					title: 'Error status :: ' + error.response.status,
					message: 'Error setting up the request:: ' + error.message,
					color: 'red',
				});
			}
			return Promise.reject(error);
		}
	);

	return instance;
}
