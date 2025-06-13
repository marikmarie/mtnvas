import { Button, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface Shop {
	id: string;
	name: string;
}

interface AddShopUserModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
	shops: Shop[];
}

interface ShopUserFormValues {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	shopId: string;
	role: string;
}

export function AddShopUserModal({ opened, onClose, dealer, shops }: AddShopUserModalProps) {
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ShopUserFormValues>({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			shopId: '',
			role: 'shop_user',
		},
		validate: {
			firstName: (value) => (!value ? 'First name is required' : null),
			lastName: (value) => (!value ? 'Last name is required' : null),
			email: (value) => (!value ? 'Email is required' : null),
			phone: (value) => (!value ? 'Phone number is required' : null),
			shopId: (value) => (!value ? 'Shop is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ShopUserFormValues) => {
			return request.post(`/dealer-groups/${dealer.id}/users`, values);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dealer', dealer.id] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ShopUserFormValues) => {
		mutation.mutate(values);
	};

	const shopOptions = shops.map((shop) => ({
		value: shop.id,
		label: shop.name,
	}));

	const selectedShop = shops.find((s) => s.id === form.values.shopId);

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<Stack>
				<Title order={3}>Add User</Title>
				<Text
					size="sm"
					color="dimmed"
				>
					Adding user to shop: {selectedShop?.name || 'Select a shop'}
				</Text>

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack spacing="md">
						<TextInput
							label="First Name"
							placeholder="Enter first name"
							required
							{...form.getInputProps('firstName')}
						/>

						<TextInput
							label="Last Name"
							placeholder="Enter last name"
							required
							{...form.getInputProps('lastName')}
						/>

						<TextInput
							label="Email"
							placeholder="Enter email"
							required
							{...form.getInputProps('email')}
						/>

						<TextInput
							label="Phone Number"
							placeholder="Enter phone number"
							required
							{...form.getInputProps('phone')}
						/>

						<Select
							label="Shop"
							placeholder="Select shop"
							required
							data={shopOptions}
							{...form.getInputProps('shopId')}
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
								Add User
							</Button>
						</Group>
					</Stack>
				</form>
			</Stack>
		</Modal>
	);
}
