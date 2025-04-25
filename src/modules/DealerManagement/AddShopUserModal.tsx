import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { Modal } from '../../components/Modal';
import { ShopUserModalProps } from './types';
import { useForm } from '@mantine/form';

export function AddShopUserModal({ opened, onClose, shop, userType }: ShopUserModalProps) {
	const form = useForm({
		initialValues: {
			name: '',
			email: '',
			msisdn: '',
		},
		validate: {
			name: (value) => (!value ? 'Name is required' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			msisdn: (value) => {
				if (!value) return 'Phone number is required';
				if (!/^256\d{9}$/.test(value))
					return 'Phone number must start with 256 followed by 9 digits';
				return null;
			},
		},
	});

	const handleSubmit = form.onSubmit((values) => {
		const userData = {
			...values,
			shopId: shop.id,
			shopName: shop.name,
			userType,
		};
		console.log(`Add ${userType}:`, userData);
		// Here you would typically make an API call to create the user
		// The endpoint would be different based on userType
		// e.g., /api/shops/${shop.id}/dsa for DSA
		// or /api/shops/${shop.id}/retailer for Retailer
		// or /api/shops/${shop.id}/agent for Shop Agent
		onClose();
		form.reset();
	});

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<Stack>
				<Title order={3}>Add {userType}</Title>
				<Text
					size="sm"
					color="dimmed"
				>
					Adding {userType} to shop: {shop.name}
				</Text>

				<form onSubmit={handleSubmit}>
					<Stack>
						<TextInput
							label="Name"
							placeholder="Enter full name"
							required
							{...form.getInputProps('name')}
						/>

						<TextInput
							label="Email"
							placeholder="Enter email address"
							required
							{...form.getInputProps('email')}
						/>

						<TextInput
							label="Phone Number"
							placeholder="Enter phone number (e.g., 256123456789)"
							required
							{...form.getInputProps('msisdn')}
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
							<Button type="submit">Add {userType}</Button>
						</Group>
					</Stack>
				</form>
			</Stack>
		</Modal>
	);
}
