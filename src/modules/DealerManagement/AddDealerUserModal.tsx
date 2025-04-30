import { Button, Group, Stack, TextInput, Title } from '@mantine/core';
import { Modal } from '../../components/Modal';
import { Dealer } from './types';
import { useForm } from '@mantine/form';

interface AddDealerUserModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
	userType: 'DSA' | 'Retailer';
}

export function AddDealerUserModal({ opened, onClose, dealer, userType }: AddDealerUserModalProps) {
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
			dealerId: dealer.id,
			dealerName: dealer.name,
			userType,
		};
		console.log(`Add ${userType} to dealer:`, userData);
		// Here you would typically make an API call to create the user for the dealer
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
