import { useCallback, useEffect, useState } from 'react';
import useRequest from './use-request';
import { Activation } from '../modules/Reports';

export function useActivations() {
	const request = useRequest(true);

	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(false);

	const [activations, setActivations] = useState<{ data: Activation[] }>({ data: [] });
	const [filtered, setFiltered] = useState<Activation[]>([]);

	const handleGetActivationsReport = useCallback(async () => {
		try {
			setLoading(true);
			const response = await request.get('/activations');
			setActivations(response.data as unknown as { data: Activation[] });
			setLoading(false);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		handleGetActivationsReport();
	}, []);

	useEffect(() => {
		const regex = new RegExp(searchQuery, 'i');
		const filtered = activations.data.filter((activation) => {
			const msisdn = activation.msisdn.toLowerCase();
			return regex.test(msisdn);
		});
		setFiltered(filtered);
	}, [searchQuery, activations]);

	return {
		filtered,
		searchQuery,
		setSearchQuery,
		loading,
	};
}
