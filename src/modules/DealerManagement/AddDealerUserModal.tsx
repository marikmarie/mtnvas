import { Button, Group, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface AddDealerUserModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
	userType: 'DSA' | 'Retailer';
}

export function AddDealerUserModal({ opened, onClose, dealer, userType }: AddDealerUserModalProps) {
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm({
		initialValues: {
			name: '',
			email: '',
			msisdn: '',
			username: '',
			department: 'WAKANET',
			category: 'CEX_PLUS',
			role: userType.toLowerCase(),
			location: '',
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
			username: (value) => (!value ? 'Username is required' : null),
			location: (value) => (!value ? 'Location is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: () =>
			request.post('/users', {
				...form.values,
				dealerGroup: dealer.name,
			}),
		mutationKey: ['users'],
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit(() => mutation.mutate());

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
							label="Username"
							placeholder="Enter username"
							required
							{...form.getInputProps('username')}
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
						<TextInput
							label="Location"
							placeholder="Enter location"
							required
							{...form.getInputProps('location')}
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
								Add {userType}
							</Button>
						</Group>
					</Stack>
				</form>
			</Stack>
		</Modal>
	);
}
