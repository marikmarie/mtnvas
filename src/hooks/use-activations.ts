import { useState, useMemo } from 'react';
import useRequest from './use-request';
import { Activation } from '../modules/Reports/Activations';
import { useQuery } from '@tanstack/react-query';

export function useActivations() {
	const request = useRequest(true);
	const [searchQuery, setSearchQuery] = useState('');

	const fetchActivations = async () => {
		const response = await request.get('/activations');
		return response.data as { data: Activation[] };
	};

	const { data: activations, isLoading } = useQuery(['activations'], fetchActivations, {
		refetchOnWindowFocus: false,
	});

	const filteredActivations = useMemo(() => {
		const regex = new RegExp(searchQuery, 'i');
		return activations?.data.filter((activation) => {
			const msisdn = activation.msisdn.toLowerCase();
			return regex.test(msisdn);
		});
	}, [searchQuery, activations?.data]);

	console.log('filteredActivations', filteredActivations);

	return {
		filtered: filteredActivations || [],
		searchQuery,
		setSearchQuery,
		loading: isLoading,
	};
}
