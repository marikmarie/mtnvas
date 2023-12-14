import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../app/store'

export default function useAxios() {
	const token = useSelector( ( state: RootState ) => state.auth.jwtToken )
	return axios.create( {
		baseURL: import.meta.env.VITE_APP_BASE_URL!,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	} )
}
