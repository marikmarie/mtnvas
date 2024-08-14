import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useRequest from './useRequest';
import { format } from 'date-fns';

const RENEWALS_QUERY_KEY = ['activations'] as const;
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
	searchTerm?: string;
}

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
		if (dateRange[0]) queryParams.append('from', format(dateRange[0], 'yyyy-MM-dd'));
		if (dateRange[1]) queryParams.append('to', format(dateRange[1], 'yyyy-MM-dd'));
		if (options.searchTerm || appliedSearchQuery) {
			queryParams.append('searchTerm', options.searchTerm || appliedSearchQuery);
		}

		const queryString = queryParams.toString();
		const url = `/activations${queryString ? `?${queryString}` : ''}`;

		const response = await request.get<{ data: Activation[] }>(url);
		return response.data.data || [];
	}, [request, options, appliedSearchQuery, dateRange]);

	const queryKey = useMemo(
		() => [...RENEWALS_QUERY_KEY, options, appliedSearchQuery, dateRange],
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

	const filteredActivations = useMemo(() => {
		if (!appliedSearchQuery.trim()) return activations;

		const regex = new RegExp(appliedSearchQuery, 'i');
		return activations.filter((activation) => {
			const searchableContent = [activation.msisdn].join(' ').toLowerCase();
			return regex.test(searchableContent);
		});
	}, [appliedSearchQuery, activations]);

	const applySearch = useCallback(() => {
		setAppliedSearchQuery(searchQuery);
	}, [searchQuery]);

	const resetSearchFilters = useCallback(() => {
		setAppliedSearchQuery('');
		setSearchQuery('');
		setDateRange([null, null]);
	}, []);

	return {
		activations: filteredActivations,
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
