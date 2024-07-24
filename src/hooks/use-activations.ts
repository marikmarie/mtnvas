import { useState, useEffect } from 'react';
import useRequest from './use-request';
import { Activation } from '../modules/Reports/Activations';
import { useQuery } from '@tanstack/react-query';

export function useActivations() {
	const request = useRequest(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filtered, setFiltered] = useState<Activation[]>([]);

	const fetchActivations = async () => {
		const response = await request.get('/activations');
		return response.data as { data: Activation[] };
	};

	const { data: activations, isLoading } = useQuery(['activations'], fetchActivations, {
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (activations?.data) {
			const regex = new RegExp(searchQuery, 'i');
			const filteredData = activations.data.filter((activation) => {
				const msisdn = activation.msisdn.toLowerCase();
				return regex.test(msisdn);
			});
			setFiltered(filteredData);
		}
	}, [searchQuery, activations]);

	return {
		filtered,
		searchQuery,
		setSearchQuery,
		loading: isLoading,
	};
}
