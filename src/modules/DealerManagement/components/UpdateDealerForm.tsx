import { useForm } from '@mantine/form';
import { TextInput, Button, Stack, Select, Group } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useRequest from '../../../hooks/useRequest';
import { notifications } from '@mantine/notifications';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

interface Dealer {
	id: string;
	name: string;
	contactPerson: string;
	email: string;
	phone: string;
	category: 'wakanet' | 'enterprise' | 'both';
}

interface UpdateDealerFormProps {
	dealerId: string;
}

export const UpdateDealerForm: React.FC<UpdateDealerFormProps> = ({ dealerId }) => {
	const queryClient = useQueryClient();
	const request = useRequest();
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			name: '',
			contactPerson: '',
			email: '',
			phone: '',
			category: 'wakanet' as 'wakanet' | 'enterprise' | 'both',
		},

		validate: {
			name: (value) => (value.trim().length > 0 ? null : 'Dealer name is required'),
			contactPerson: (value) =>
				value.trim().length > 0 ? null : 'Contact person is required',
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			phone: (value) => (value.trim().length > 5 ? null : 'Valid phone number is required'),
		},
	});

	// Fetch dealer details
	const { isLoading } = useQuery<AxiosResponse<{ data: Dealer }>, AxiosError>({
		queryKey: ['dealer', dealerId],
		queryFn: () => request.get(`/dealers/${dealerId}`),
		onSuccess: (response) => {
			const dealer = response.data.data;
			form.setValues({
				name: dealer.name,
				contactPerson: dealer.contactPerson,
				email: dealer.email,
				phone: dealer.phone,
				category: dealer.category,
			});
		},
		onError: (error) => {
			notifications.show({
				title: 'Error',
				// @ts-ignore
				message: error.response?.data?.message || 'Failed to fetch dealer details',
				color: 'red',
			});
			navigate(ROUTES.DEALER_MANAGEMENT.ROOT);
		},
	});

	const updateDealerMutation = useMutation<AxiosResponse, AxiosError, typeof form.values>({
		mutationFn: (dealerData) => request.put(`/dealers/${dealerId}`, dealerData),
		onSuccess: async (response) => {
			notifications.show({
				autoClose: 3000,
				title: 'Success',
				message: response.data?.message || 'Dealer updated successfully',
				color: 'green',
			});
			await queryClient.invalidateQueries({ queryKey: ['dealers'] });
			navigate(ROUTES.DEALER_MANAGEMENT.ROOT);
		},
		onError: (error) => {
			notifications.show({
				autoClose: 5000,
				title: 'Failed to update dealer',
				// @ts-ignore
				message: error.response?.data?.message || error.message,
				color: 'red',
			});
		},
	});

	const handleSubmit = (values: typeof form.values) => {
		updateDealerMutation.mutate(values);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack>
				<TextInput
					required
					label="Dealer Name"
					placeholder="Enter dealer name"
					{...form.getInputProps('name')}
				/>
				<TextInput
					required
					label="Contact Person"
					placeholder="Enter contact person name"
					{...form.getInputProps('contactPerson')}
				/>
				<TextInput
					required
					label="Email"
					placeholder="Enter email address"
					{...form.getInputProps('email')}
				/>
				<TextInput
					required
					label="Phone Number"
					placeholder="Enter phone number"
					{...form.getInputProps('phone')}
				/>
				<Select
					label="Category"
					data={[
						{ value: 'wakanet', label: 'Wakanet' },
						{ value: 'enterprise', label: 'Enterprise' },
						{ value: 'both', label: 'Both' },
					]}
					{...form.getInputProps('category')}
				/>
				<Group position="apart">
					<Button
						variant="subtle"
						onClick={() => navigate(ROUTES.DEALER_MANAGEMENT.ROOT)}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={updateDealerMutation.isLoading}
					>
						Update Dealer
					</Button>
				</Group>
			</Stack>
		</form>
	);
};
