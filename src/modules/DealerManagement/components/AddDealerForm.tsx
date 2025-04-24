import { useForm } from '@mantine/form';
import { TextInput, Button, Stack, Select, Group } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useRequest from '../../../hooks/useRequest';
import { notifications } from '@mantine/notifications';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

interface AddDealerFormProps {
	onSuccess?: () => void;
}

export const AddDealerForm: React.FC<AddDealerFormProps> = ({ onSuccess }) => {
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

	const addDealerMutation = useMutation<AxiosResponse, AxiosError, typeof form.values>({
		mutationFn: (dealerData) => request.post('/dealers', dealerData),
		onSuccess: async (response) => {
			notifications.show({
				autoClose: 3000,
				title: 'Success',
				message: response.data?.message || 'Dealer added successfully',
				color: 'green',
			});
			await queryClient.invalidateQueries({ queryKey: ['dealers'] });
			form.reset();
			onSuccess?.();
		},
		onError: (error) => {
			notifications.show({
				autoClose: 5000,
				title: 'Failed to add dealer',
				// @ts-ignore
				message: error.response?.data?.message || error.message,
				color: 'red',
			});
		},
	});

	const handleSubmit = (values: typeof form.values) => {
		addDealerMutation.mutate(values);
	};

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
						loading={addDealerMutation.isLoading}
					>
						Add Dealer
					</Button>
				</Group>
			</Stack>
		</form>
	);
};
