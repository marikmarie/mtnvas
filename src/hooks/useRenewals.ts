import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useRequest from './useRequest';
import { Renewal } from '../modules/Reports/Renewals';
import { format } from 'date-fns';

const RENEWALS_QUERY_KEY = ['renewals'] as const;

interface Options {
	page?: number;
	pageSize?: number;
	from?: Date;
	to?: Date;
	searchTerm?: string;
}

export default function useRenewals(options: Options = {}) {
	const [searchQuery, setSearchQuery] = useState('');
	const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
	const request = useRequest(true);

	const fetchRenewals = useCallback(async () => {
		const queryParams = new URLSearchParams();

		if (options.page !== undefined) queryParams.append('page', options.page.toString());
		if (options.pageSize !== undefined)
			queryParams.append('pageSize', options.pageSize.toString());
		if (dateRange[0]) queryParams.append('from', format(dateRange[0], 'yyyy-MM-dd'));
		if (dateRange[1]) queryParams.append('to', format(dateRange[1], 'yyyy-MM-dd'));
		if (options.searchTerm || appliedSearchQuery) {
			queryParams.append('searchTerm', options.searchTerm || appliedSearchQuery);
		}

		const queryString = queryParams.toString();
		const url = `/renewals${queryString ? `?${queryString}` : ''}`;

		const response = await request.get<{ data: Renewal[] }>(url);
		return response.data.data || [];
	}, [request, options, appliedSearchQuery, dateRange]);

	const queryKey = useMemo(
		() => [...RENEWALS_QUERY_KEY, options, appliedSearchQuery, dateRange],
		[options, appliedSearchQuery, dateRange]
	);

	const {
		data: renewals = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey,
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

	const applySearch = useCallback(() => {
		setAppliedSearchQuery(searchQuery);
	}, [searchQuery]);

	const resetSearchFilters = useCallback(() => {
		setAppliedSearchQuery('');
		setSearchQuery('');
		setDateRange([null, null]);
	}, []);

	return {
		renewals: filteredRenewals,
		searchQuery,
		dateRange,
		setDateRange,
		resetSearchFilters,
		setSearchQuery,
		applySearch,
		isLoading,
		error,
		refetch,
	};
}
