import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useRequest from './useRequest';
import { format, isValid } from 'date-fns';

const ACTIVATIONS_QUERY_KEY = ['activations'] as const;

export interface Activation {
	subscriptionId: string;
	msisdn: string;
	email: string;
	bnumber?: string;
	salesAgentEmail: string;
	createdAt: string;
	status: string;
	activatedAt: string;
	activatedBy: string;
}

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

export default function useActivations(options: Options = {}) {
	const [searchQuery, setSearchQuery] = useState('');
	const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
	const request = useRequest(true);

	const fetchActivations = useCallback(async () => {
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
		const url = `/activations${queryString ? `?${queryString}` : ''}`;

		try {
			const response = await request.get<{ data: Activation[] }>(url);
			return response.data.data || [];
		} catch (error) {
			console.error('Error fetching activations:', error);
			throw error;
		}
	}, [request, options, appliedSearchQuery, dateRange]);

	const queryKey = useMemo(
		() => [...ACTIVATIONS_QUERY_KEY, options, appliedSearchQuery, dateRange],
		[options, appliedSearchQuery, dateRange]
	);

	const {
		data: activations = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey,
		queryFn: fetchActivations,
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
		activations,
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
