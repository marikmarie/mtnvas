import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useRequest from './useRequest';
import { format, isValid, startOfMonth } from 'date-fns';

interface Options {
	page?: number;
	pageSize?: number;
	msisdn?: string;
	bnumber?: string;
	endpoint: string;
}

interface ReportItem {
	[key: string]: any;
}

const isMsisdn = (number: string): boolean => /^(\+?2567|07)\d{8}$/.test(number);
const isBnumber = (number: string): boolean => /^25639\d{7}$/.test(number);

export default function useReportData(options: Options) {
	const [searchQuery, setSearchQuery] = useState('');
	const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
	const [fromDate, setFromDate] = useState<Date | null>(() => startOfMonth(new Date()));
	const [toDate, setToDate] = useState<Date | null>(null);
	const [totalCount, setTotalCount] = useState(0);

	const request = useRequest(true);

	const fetchReportData = useCallback(async () => {
		const queryParams = new URLSearchParams();

		if (options.page !== undefined) queryParams.append('page', options.page.toString());
		if (options.pageSize !== undefined)
			queryParams.append('pageSize', options.pageSize.toString());
		if (fromDate && isValid(fromDate))
			queryParams.append('from', format(fromDate, 'yyyy-MM-dd'));
		if (toDate && isValid(toDate)) queryParams.append('to', format(toDate, 'yyyy-MM-dd'));

		const searchTerm = appliedSearchQuery || options.msisdn || options.bnumber;
		if (searchTerm) {
			if (isMsisdn(searchTerm)) {
				queryParams.append('msisdn', searchTerm);
			} else if (isBnumber(searchTerm)) {
				queryParams.append('bnumber', searchTerm);
			}
		}

		const queryString = queryParams.toString();
		const url = `${options.endpoint}${queryString ? `?${queryString}` : ''}`;

		try {
			const response = await request.get<{
				message: string;
				statusCode: number;
				totalcount: number;
				data: ReportItem[];
			}>(url);
			setTotalCount(response.data.totalcount);
			return response.data.data || [];
		} catch (error) {
			console.error('Error fetching report data:', error);
			throw error;
		}
	}, [request, options, appliedSearchQuery, fromDate, toDate]);

	const queryKey = useMemo(
		() => [options.endpoint, options, appliedSearchQuery, fromDate, toDate],
		[options, appliedSearchQuery, fromDate, toDate]
	);

	const {
		data: reportItems = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey,
		queryFn: fetchReportData,
		refetchOnWindowFocus: false,
	});

	const applySearch = useCallback(() => {
		setAppliedSearchQuery(searchQuery.trim());
	}, [searchQuery]);

	const resetSearchFilters = useCallback(() => {
		setAppliedSearchQuery('');
		setSearchQuery('');
		setFromDate(() => startOfMonth(new Date()));
		setToDate(null);
	}, []);

	return {
		reportItems,
		totalCount,
		searchQuery,
		fromDate,
		toDate,
		setFromDate,
		setToDate,
		resetSearchFilters,
		setSearchQuery,
		applySearch,
		isLoading,
		error,
		refetch,
	};
}
