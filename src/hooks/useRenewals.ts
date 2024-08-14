import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useRequest from './useRequest';
import { Renewal } from '../modules/Reports/Renewals';

const RENEWALS_QUERY_KEY = ['renewals'] as const;

export const useRenewals = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const request = useRequest(true);

	const fetchRenewals = useCallback(async () => {
		const response = await request.get<{ data: Renewal[] }>('/renewals');
		return response.data.data || [];
	}, [request]);

	const {
		data: renewals = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: RENEWALS_QUERY_KEY,
		queryFn: fetchRenewals,
		refetchOnWindowFocus: false,
	});

	const filteredRenewals = useMemo(() => {
		if (!searchQuery.trim()) return renewals;

		const regex = new RegExp(searchQuery, 'i');
		return renewals.filter((renewal) => {
			const searchableContent = [
				renewal.msisdn,
				// Add other searchable fields here if needed
			]
				.join(' ')
				.toLowerCase();

			return regex.test(searchableContent);
		});
	}, [searchQuery, renewals]);

	return {
		renewals: filteredRenewals,
		searchQuery,
		setSearchQuery,
		isLoading,
		error,
	};
};
