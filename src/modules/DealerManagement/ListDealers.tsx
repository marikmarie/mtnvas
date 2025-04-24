import { memo, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ActionIcon, Flex, LoadingOverlay, Stack, Tooltip } from '@mantine/core';
import { toTitle } from '../../utils/toTitle';
import { notifications } from '@mantine/notifications';
import { customLoader } from '../../components/CustomLoader';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import { IconCircleCheck, IconDeselect, IconEdit, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ROUTES } from '../../constants/routes';

interface Dealer {
	id: string;
	name: string;
	contactPerson: string;
	email: string;
	phone: string;
	category: 'wakanet' | 'enterprise' | 'both';
	createdAt: string;
}

interface ConfirmationState {
	dealerId: string | null;
	dealerName: string;
	action: 'activate' | 'deactivate' | null;
}

const ListDealers: React.FC = () => {
	const request = useRequest(true);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
		dealerId: null,
		dealerName: '',
		action: null,
	});

	const query = useQuery<AxiosResponse<{ data: Dealer[] }>, AxiosError>({
		queryFn: () => request.get('/dealers'),
		queryKey: ['dealers'],
		onError: (error: AxiosError) => {
			notifications.show({
				autoClose: 5000,
				title: undefined,
				message:
					JSON.stringify(error.response?.data).length > 0
						? JSON.stringify(error.response?.data).replace(/\"/g, '')
						: error.message,
				color: 'red',
			});
		},
	});

	const columns = ['name', 'contactPerson', 'email', 'phone', 'category', 'createdAt'].map(
		(column) => ({
			name: column,
			header: toTitle(column),
			defaultFlex: 1,
			render:
				column === 'createdAt'
					? ({ value }: { value: string }) => new Date(value).toLocaleString('en-UK')
					: undefined,
		})
	);

	const activationMutation = useMutation<AxiosResponse, AxiosError, string>({
		mutationFn: (dealerId: string) => request.post(`/dealers/${dealerId}/activate`),
		onSuccess: async (response) => {
			notifications.show({
				autoClose: 3000,
				title: 'Success',
				message: response.data?.message || 'Dealer activated',
				color: 'green',
			});
			await queryClient.invalidateQueries({ queryKey: ['dealers'] });
			handleCloseConfirmation();
		},
		onError: (error) => {
			notifications.show({
				autoClose: 5000,
				title: 'Activation Failed',
				message: JSON.stringify(error.response?.data) || error.message,
				color: 'red',
			});
			handleCloseConfirmation();
		},
	});

	const deactivationMutation = useMutation<AxiosResponse, AxiosError, string>({
		mutationFn: (dealerId: string) => request.post(`/dealers/${dealerId}/deactivate`),
		onSuccess: async (response) => {
			notifications.show({
				autoClose: 3000,
				title: 'Success',
				message: response.data?.message || 'Dealer deactivated',
				color: 'green',
			});
			await queryClient.invalidateQueries({ queryKey: ['dealers'] });
			handleCloseConfirmation();
		},
		onError: (error) => {
			notifications.show({
				autoClose: 5000,
				title: 'Deactivation Failed',
				message: JSON.stringify(error.response?.data) || error.message,
				color: 'red',
			});
			handleCloseConfirmation();
		},
	});

	const handleCloseConfirmation = () => {
		setConfirmationState({ dealerId: null, dealerName: '', action: null });
	};

	const handleConfirmAction = () => {
		if (!confirmationState.dealerId || !confirmationState.action) return;

		if (confirmationState.action === 'activate') {
			activationMutation.mutate(confirmationState.dealerId);
		} else {
			deactivationMutation.mutate(confirmationState.dealerId);
		}
	};

	const handleViewDetails = (dealerId: string) => {
		// TODO: Implement view details page
		console.log('View details:', dealerId);
	};

	const handleEdit = (dealerId: string) => {
		navigate(ROUTES.DEALER_MANAGEMENT.EDIT.replace(':id', dealerId));
	};

	columns.push({
		name: 'actions',
		header: 'Actions',
		minWidth: 180,
		headerAlign: 'center',
		// @ts-ignore - Inovua DataGrid typing can be tricky with render props
		render: ({ data }: { data: Dealer }) => {
			const dealerName = data?.name || data?.id;
			const isActive = data?.category === 'wakanet';
			return (
				<Flex
					justify={'center'}
					align="center"
					gap={'xs'}
				>
					<Tooltip
						withArrow
						label={`View ${dealerName} details`}
					>
						<ActionIcon
							variant="subtle"
							color="blue"
							onClick={() => handleViewDetails(data.id)}
						>
							<IconEye size="1rem" />
						</ActionIcon>
					</Tooltip>
					<Tooltip
						withArrow
						label={`Edit ${dealerName}`}
					>
						<ActionIcon
							variant="subtle"
							color="gray"
							onClick={() => handleEdit(data.id)}
						>
							<IconEdit size="1rem" />
						</ActionIcon>
					</Tooltip>
					{isActive ? (
						<Tooltip
							withArrow
							label={`Deactivate ${dealerName}`}
						>
							<ActionIcon
								onClick={() =>
									setConfirmationState({
										dealerId: data.id,
										dealerName,
										action: 'deactivate',
									})
								}
								variant="subtle"
								color="red"
							>
								<IconDeselect size="1rem" />
							</ActionIcon>
						</Tooltip>
					) : (
						<Tooltip
							withArrow
							label={`Activate ${dealerName}`}
						>
							<ActionIcon
								onClick={() =>
									setConfirmationState({
										dealerId: data.id,
										dealerName,
										action: 'activate',
									})
								}
								variant="subtle"
								color="green"
							>
								<IconCircleCheck size="1rem" />
							</ActionIcon>
						</Tooltip>
					)}
				</Flex>
			);
		},
	});

	const dealers = query.data?.data?.data ?? [];

	const table = useDataGridTable<Dealer>({
		columns,
		data: dealers.length > 0 ? dealers.slice().reverse() : [],
		loading: query.isLoading,
		mih: '60vh',
	});

	return (
		<Stack>
			<LoadingOverlay
				visible={query.isLoading}
				zIndex={999}
				loader={customLoader}
			/>
			{table}
			<ConfirmationModal
				opened={confirmationState.action !== null}
				onClose={handleCloseConfirmation}
				onConfirm={handleConfirmAction}
				title={`${confirmationState.action === 'activate' ? 'Activate' : 'Deactivate'} Dealer`}
				message={`Are you sure you want to ${
					confirmationState.action === 'activate' ? 'activate' : 'deactivate'
				} ${confirmationState.dealerName}?`}
				loading={activationMutation.isLoading || deactivationMutation.isLoading}
				confirmLabel={confirmationState.action === 'activate' ? 'Activate' : 'Deactivate'}
			/>
		</Stack>
	);
};

export default memo(ListDealers);
