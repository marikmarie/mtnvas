import { useState, useEffect } from 'react';
import useRequest from './use-request';
import { Renewal } from '../modules/Reports/Renewals';
import { useQuery } from '@tanstack/react-query';

export function useRenewals() {
	const request = useRequest(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filtered, setFiltered] = useState<Renewal[]>([]);

	const fetchRenewals = async () => {
		const response = await request.get('/renewals');
		return response.data as { data: Renewal[] };
	};

	const { data: renewals, isLoading } = useQuery(['renewals'], fetchRenewals, {
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (renewals?.data) {
			const regex = new RegExp(searchQuery, 'i');
			const filteredData = renewals.data.filter((renewal: Renewal) => {
				const msisdn = renewal.msisdn.toLowerCase();
				return regex.test(msisdn);
			});
			setFiltered(filteredData);
		}
	}, [searchQuery, renewals]);

	return {
		filtered,
		searchQuery,
		setSearchQuery,
		loading: isLoading,
	};
}
