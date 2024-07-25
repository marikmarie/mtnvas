import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Renewal } from '../modules/Reports/Renewals';
import useRequest from './use-request';

export function useRenewals() {
	const request = useRequest(true);
	const [searchQuery, setSearchQuery] = useState('');

	const fetchRenewals = async () => {
		const response = await request.get('/renewals');
		return response.data as { data: Renewal[] };
	};

	const { data: renewals, isLoading } = useQuery(['renewals'], fetchRenewals, {
		refetchOnWindowFocus: false,
	});

	const filtered = useMemo(() => {
		console.log('Filtering renewals', { searchQuery, renewalsData: renewals?.data });
		if (!renewals?.data) return [];

		if (!searchQuery.trim()) return renewals.data;

		return renewals.data.filter((renewal: Renewal) =>
			renewal.msisdn.toLowerCase().includes(searchQuery.trim().toLowerCase())
		);
	}, [searchQuery, renewals]);

	console.log('useRenewals hook result', { filtered, searchQuery, loading: isLoading });

	const result = useMemo(
		() => ({
			filtered,
			searchQuery,
			setSearchQuery,
			loading: isLoading,
		}),
		[filtered, searchQuery, isLoading]
	);

	console.log('useRenewals hook result', result);

	return result;
}
