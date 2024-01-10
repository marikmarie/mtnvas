import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create( {
	baseURL: import.meta.env.VITE_APP_BASE_URL!,
} );

instance.interceptors.request.use( ( config ) => {
	if ( config.headers['Access-Control-Request-Headers'] ) {
		delete config.headers['Access-Control-Request-Headers'];
	}
	return config;
} );

export default function useAxios() {
	return instance;
}
