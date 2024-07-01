import { memo } from 'react';
import useRequest from '../../hooks/use-request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ActionIcon, Flex, LoadingOverlay, Stack, Tooltip } from '@mantine/core';
import { toTitle } from '../../utils/to-title';
import { notifications } from '@mantine/notifications';
import { customLoader } from '../CustomLoader';
import { useDataGridTable } from '../../hooks/use-data-grid-table';
import { IconCircleCheck, IconDeselect } from '@tabler/icons-react';

interface Props {}

function ListUsers(props: Props) {
	const {} = props;
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const query = useQuery({
		queryFn: () => request.get('/users'),
		queryKey: ['users'],
		onSuccess: (_: AxiosResponse) => {},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				title: 'FAILURE',
				message: JSON.stringify(error.response?.data),
				color: 'red',
			});
		},
	});

	const columns = ['name', 'email', 'role', 'status', 'category', 'createdAt'].map((column) => ({
		name: column,
		header: toTitle(column),
		defaultFlex: 1,
	}));

	const activationMutation = useMutation({
		mutationFn: (email: string) => request.post(`/users/${email}/activate`),
		onSuccess: async (response: AxiosResponse) => {
			notifications.show({
				autoClose: 5000,
				title: 'Success',
				// @ts-ignore
				message: response.data.message,
				color: 'green',
			});
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			});
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				title: 'FAILURE',
				message: JSON.stringify(error.response?.data),
				color: 'red',
			});
		},
	});
	const deactivationMutation = useMutation({
		mutationFn: (email: string) => request.post(`/users/${email}/deactivate`),
		onSuccess: async (response: AxiosResponse) => {
			notifications.show({
				autoClose: 5000,
				title: 'Success',
				// @ts-ignore
				message: response.data.message,
				color: 'green',
			});
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			});
		},
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				title: 'FAILURE',
				message: JSON.stringify(error.response?.data),
				color: 'red',
			});
		},
	});

	columns.push({
		name: 'Actions',
		header: 'DE/ACTIVATE',
		// @ts-ignore
		render({ data }) {
			const user = data?.name || data?.email.split('@')[0];
			return (
				<Flex
					justify={'space-between'}
					align="center"
					gap={'sm'}
				>
					<Tooltip
						withArrow
						label={`Click to activate ${user}`}
					>
						<ActionIcon
							onClick={() => activationMutation.mutate(data?.email)}
							variant="outline"
							w="100%"
							color="green"
						>
							<IconCircleCheck />
						</ActionIcon>
					</Tooltip>
					<Tooltip
						withArrow
						label={`Click to deactivate ${user}`}
					>
						<ActionIcon
							onClick={() => deactivationMutation.mutate(data?.email)}
							variant="outline"
							w="100%"
							color="red"
						>
							<IconDeselect />
						</ActionIcon>
					</Tooltip>
				</Flex>
			);
		},
		headerAlign: 'center',
		defaultFlex: 1,
	});

	const users = query?.data?.data?.data as unknown[] as any[];

	const table = useDataGridTable({
		columns,
		data: users ? users.reverse() : [],
		loading: query.isLoading,
		mih: '50vh',
	});

	return (
		<Stack>
			<LoadingOverlay
				visible={query.isLoading}
				zIndex={999}
				loader={customLoader}
			/>
			{query.isLoading ? null : table}
		</Stack>
	);
}

export default memo(ListUsers);
