import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setServiceCode, setSubscriptionId } from '../../../app/slices/BundleActivations';
import useRequest from '../../../hooks/useRequest';
import { toTitle } from '../../../utils/toTitle';
import { useDataGridTable } from '../../../hooks/useDataGridTable';
import { ActionIcon } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

type Data = {
	subscriptionId: string;
	msisdn: string;
	email: string;
	serviceCode: string;
	createdAt: string;
};

const BundleActivationsReport = () => {
	const dispatch = useDispatch();
	const request = useRequest(true);

	const fetchBundleActivations = useCallback(async () => {
		const response = await request.get('/bundle-activations');
		return response.data as { data: Data[] };
	}, [request]);

	const { data: activations, isLoading } = useQuery(
		['bundleActivations'],
		fetchBundleActivations
	);

	const onSelect = useCallback(
		(data: Data) => {
			dispatch(setSubscriptionId(data.subscriptionId));
			dispatch(setServiceCode(data.serviceCode));
		},
		[dispatch]
	);

	const columns = [
		...['subscriptionId', 'msisdn', 'email', 'serviceCode', 'createdAt'].map((column) => ({
			name: column,
			header: column === 'createdAt' ? 'PERFORMED AT' : toTitle(column),
			defaultFlex: 1,
			render:
				column === 'createdAt'
					? ({ data }: { data: Data }) => (
							<>
								{new Date(data.createdAt).toLocaleDateString('en-UK')}{' '}
								{new Date(data.createdAt).toLocaleTimeString('en-UK')}
							</>
						)
					: undefined,
		})),
		{
			name: 'action_select',
			header: 'ACTION/SELECT',
			defaultFlex: 1,
			render: ({ data }: { data: Data }) => (
				<ActionIcon
					onClick={() => onSelect(data)}
					variant="filled"
					w="100%"
					color="yellow"
				>
					<IconCircleCheck /> Select
				</ActionIcon>
			),
		},
	];

	const activationsReportTable = useDataGridTable({
		columns,
		data: activations?.data || [],
		loading: isLoading,
		mih: '50vh',
	});

	return activationsReportTable;
};

export default memo(BundleActivationsReport);
