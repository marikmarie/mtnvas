import { useQuery, useMutation, UseQueryResult, UseMutationResult, QueryKey } from '@tanstack/react-query'
import useAxios from '../hooks/use-axios'
import { AxiosError, AxiosResponse } from 'axios'

export type Method = 'GET' | 'DELETE' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH'
export type RESPONSE = UseMutationResult<AxiosResponse, AxiosError> | UseQueryResult<AxiosResponse, AxiosError> | null

export function useRequest(
	method: Method,
	key: QueryKey,
	url: string,
	onSuccess?: ((data: AxiosResponse<any, any>, variables: unknown, context: unknown) => unknown) | undefined,
	data?: any,
	config?: any,
	enabled?: boolean,
): RESPONSE {
	const axios = useAxios()

	if (method === 'GET') {
		return useQuery({
			queryKey: key,
			queryFn: () => axios.get(`${url}`, {}).then(res => res.data),
			enabled,
		})
	} else if (method === 'POST') {
		return useMutation({
			mutationFn: () => axios.post(`${url}`, data, config),
			onSuccess,
		})
	} else if (method === 'DELETE') {
		return useMutation({
			mutationFn: () => axios.post(`${url}`, data, config),
			onSuccess,
		})
	} else if (method === 'PUT') {
		return useMutation({
			mutationFn: () => axios.put(`${url}`, data, config),
			onSuccess,
		})
	} else if (method === 'PATCH') {
		return useMutation({
			mutationFn: () => axios.patch(`${url}`, data, config),
			onSuccess,
		})
	}
	return null
}
