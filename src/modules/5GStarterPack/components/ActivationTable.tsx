import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setServiceCode, setSubscriptionId } from '../../../app/slices/bundle-activations';
import useRequest from '../../../hooks/use-request';
import { toTitle } from '../../../utils/to-title';
import { useDataGridTable } from '../../../hooks/use-data-grid-table';
import { ActionIcon } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
type Data = {
	subscriptionId: string;
	msisdn: string;
	email: string;
	serviceCode: string;
	createdAt: string;
};

export default memo(() => {
	const dispatch = useDispatch();
	const request = useRequest(true);
	const [loading, setLoading] = useState(false);
	const [activations, setActivations] = useState<{ data: Data[] }>({ data: [] });

	const onSelect = useCallback((data: any) => {
		dispatch(setSubscriptionId(data['subscriptionId']));
		dispatch(setServiceCode(data['serviceCode']));
	}, []);

	const columns = ['subscriptionId', 'msisdn', 'email', 'serviceCode', 'createdAt'].map(
		(column) => {
			if (column === 'createdAt') {
				return {
					name: column,
					header: 'PERFORMED AT',
					defaultFlex: 1,
					// @ts-ignore
					render: ({ data }) => (
						<>
							{new Date(data['createdAt']).toLocaleDateString('en-UK')}{' '}
							{new Date(data['createdAt']).toLocaleTimeString('en-UK')}
						</>
					),
				};
			}
			return {
				name: column,
				header: toTitle(column),
				defaultFlex: 1,
			};
		}
	);

	columns.push({
		name: 'action_select',
		header: 'ACTION/SELECT',
		defaultFlex: 1,
		// @ts-ignore
		render({ data }) {
			return (
				<ActionIcon
					onClick={() => onSelect(data)}
					variant="outline"
					w="100%"
					color="yellow"
				>
					<IconCircleCheck /> Select
				</ActionIcon>
			);
		},
	});

	const activationsReportTable = useDataGridTable({
		columns: columns,
		data: activations.data,
		loading,
		mih: '60vh',
	});

	const getBundleActivations = useCallback(async () => {
		try {
			setLoading(true);
			const response = await request.get('/bundle-activations');
			setActivations(response.data as unknown as { data: Data[] });
			setLoading(false);
		} catch (error) {}
	}, []);

	useEffect(() => {
		getBundleActivations();
	}, []);

	return activationsReportTable;
});
