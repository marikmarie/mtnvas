// useRenewals.ts
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useRequest from './useRequest';
import { Renewal } from '../modules/Reports/Renewals';

const RENEWALS_QUERY_KEY = ['renewals'] as const;

export const useRenewals = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
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
		if (!appliedSearchQuery.trim()) return renewals;

		const regex = new RegExp(appliedSearchQuery, 'i');
		return renewals.filter((renewal) => {
			const searchableContent = [renewal.msisdn].join(' ').toLowerCase();

			return regex.test(searchableContent);
		});
	}, [appliedSearchQuery, renewals]);

	const applySearch = () => {
		setAppliedSearchQuery(searchQuery);
	};

	return {
		renewals: filteredRenewals,
		searchQuery,
		setSearchQuery,
		applySearch,
		isLoading,
		error,
	};
};
