import { ActionIcon, Flex, LoadingOverlay, Stack, Tooltip } from '@mantine/core';
import { IconCircleCheck, IconDeselect } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memo } from 'react';
import { customLoader } from '../../components/CustomLoader';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { toTitle } from '../../utils/toTitle';

interface Props {}

function ListUsers(props: Props) {
	const {} = props;
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const query = useQuery({
		queryFn: () =>
			request.post('/users', {
				page: 1,
				pageSize: 100,
				from: new Date().toISOString().split('T')[0],
				to: new Date().toISOString().split('T')[0],
			}),
		queryKey: ['users'],
	});

	const columns = ['name', 'email', 'role', 'status', 'category', 'createdAt'].map((column) => ({
		name: column,
		header: toTitle(column),
	}));

	const activationMutation = useMutation({
		mutationFn: (email: string) => request.post(`/users/${email}/approval?status=active`),
		mutationKey: ['users'],
	});

	const deactivationMutation = useMutation({
		mutationFn: (email: string) => request.post(`/users/${email}/approval?status=inactive`),
		mutationKey: ['users'],
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
							loading={activationMutation.isLoading}
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
							loading={deactivationMutation.isLoading}
						>
							<IconDeselect />
						</ActionIcon>
					</Tooltip>
				</Flex>
			);
		},
		headerAlign: 'center',
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
