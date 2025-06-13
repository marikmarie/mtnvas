import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface AddShopModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
}

interface ShopFormValues {
	name: string;
	address: string;
	phone: string;
}

export function AddShopModal({ opened, onClose, dealer }: AddShopModalProps) {
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ShopFormValues>({
		initialValues: {
			name: '',
			address: '',
			phone: '',
		},
		validate: {
			name: (value) => (!value ? 'Shop name is required' : null),
			address: (value) => (!value ? 'Address is required' : null),
			phone: (value) => (!value ? 'Phone number is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ShopFormValues) => {
			return request.post(`/dealer-groups/${dealer.id}/shops`, values);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dealer', dealer.id] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ShopFormValues) => {
		mutation.mutate(values);
	};

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack spacing="md">
					<TextInput
						label="Shop Name"
						placeholder="Enter shop name"
						required
						{...form.getInputProps('name')}
					/>

					<TextInput
						label="Address"
						placeholder="Enter shop address"
						required
						{...form.getInputProps('address')}
					/>

					<TextInput
						label="Phone Number"
						placeholder="Enter phone number"
						required
						{...form.getInputProps('phone')}
					/>

					<Group
						position="right"
						mt="md"
					>
						<Button
							variant="subtle"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							loading={mutation.isLoading}
						>
							Add Shop
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
