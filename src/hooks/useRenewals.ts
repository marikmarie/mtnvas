import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useRequest from './useRequest';
import { Renewal } from '../modules/Reports/Renewals';
import { format, isValid } from 'date-fns';

const RENEWALS_QUERY_KEY = ['renewals'] as const;

interface Options {
	page?: number;
	pageSize?: number;
	from?: Date;
	to?: Date;
	msisdn?: string;
	bnumber?: string;
}

const isMsisdn = (number: string): boolean => /^2567\d{8}$/.test(number);
const isBnumber = (number: string): boolean => /^25639\d{7}$/.test(number);

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
		if (dateRange[0] && isValid(dateRange[0]))
			queryParams.append('from', format(dateRange[0], 'yyyy-MM-dd'));
		if (dateRange[1] && isValid(dateRange[1]))
			queryParams.append('to', format(dateRange[1], 'yyyy-MM-dd'));

		const searchTerm = appliedSearchQuery || options.msisdn || options.bnumber;
		if (searchTerm) {
			if (isMsisdn(searchTerm)) {
				queryParams.append('msisdn', searchTerm);
			} else if (isBnumber(searchTerm)) {
				queryParams.append('bnumber', searchTerm);
			}
		}

		const queryString = queryParams.toString();
		const url = `/renewals${queryString ? `?${queryString}` : ''}`;

		try {
			const response = await request.get<{ data: Renewal[] }>(url);
			return response.data.data || [];
		} catch (error) {
			console.error('Error fetching renewals:', error);
			throw error;
		}
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

	const applySearch = useCallback(() => {
		setAppliedSearchQuery(searchQuery.trim());
	}, [searchQuery]);

	const resetSearchFilters = useCallback(() => {
		setAppliedSearchQuery('');
		setSearchQuery('');
		setDateRange([null, null]);
	}, []);

	return {
		renewals,
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
