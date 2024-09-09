import axios, { AxiosInstance, AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { __prod__ } from '../utils/__prod__';
import { useNavigate } from 'react-router-dom';
import { signout } from '../app/slices/auth';
import { ROUTES } from '../constants/routes';

const BASE_URL = __prod__
	? import.meta.env.VITE_APP_BASE_URL_PROD
	: import.meta.env.VITE_APP_BASE_URL_DEV;

export default function useRequest(requireAuth: boolean = false): AxiosInstance {
	const token = useSelector((state: RootState) => state.auth.token);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	function logout() {
		dispatch(signout());
		navigate(ROUTES.AUTH);
	}

	const instance = axios.create({
		baseURL: BASE_URL,
		headers: requireAuth ? { Authorization: `Bearer ${token}` } : {},
	});

	instance.interceptors.response.use(
		(response) => {
			console.log('Sucess:status', response.status);
			return response;
		},
		(error: AxiosError) => {
			let title = 'Error';
			if (error.response) {
				const status = error.response.status;
				title = `Error ${status}`;
				// @ts-ignore
				const message = error.response.data?.message;

				console.log('status:error ', status);

				if (status === 401) {
					logout();
					title = 'Session Expired';
					notifications.show({
						title,
						message: 'Your session has expired. Please log in again.',
						color: 'yellow',
						autoClose: 5000,
					});
				} else {
					notifications.show({
						title,
						message,
						color: 'red',
						autoClose: 5000,
					});
				}
			}

			return Promise.reject(error);
		}
	);

	return instance;
}
