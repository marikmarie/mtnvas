import axios from 'axios'

export default function useAxios() {
	// const token = useSelector( ( state: RootState ) => state.auth.jwtToken )
	return axios.create( {
		baseURL: import.meta.env.VITE_APP_BASE_URL!,
	} )
}
