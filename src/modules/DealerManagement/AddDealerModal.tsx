import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Modal } from '../../components/Modal';
import { DealerModalProps } from './types';

export function AddDealerModal({ opened, onClose }: DealerModalProps) {
	const form = useForm({
		initialValues: {
			name: '',
			contactPerson: '',
			email: '',
			phone: '',
			category: '',
		},
		validate: {
			name: (value) => (!value ? 'Company name is required' : null),
			contactPerson: (value) => (!value ? 'Contact person is required' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			phone: (value) => (!value ? 'Phone number is required' : null),
			category: (value) => (!value ? 'Category is required' : null),
		},
	});

	const handleSubmit = form.onSubmit((values) => {
		console.log('Add dealer:', values);
		// Here you would typically make an API call to create the dealer
		onClose();
		form.reset();
	});

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<form onSubmit={handleSubmit}>
				<Stack>
					<TextInput
						label="Company Name"
						placeholder="Enter company name"
						required
						{...form.getInputProps('name')}
					/>

					<TextInput
						label="Contact Person"
						placeholder="Enter contact person name"
						required
						{...form.getInputProps('contactPerson')}
					/>

					<TextInput
						label="Email"
						placeholder="Enter email address"
						required
						{...form.getInputProps('email')}
					/>

					<TextInput
						label="Phone"
						placeholder="Enter phone number"
						required
						{...form.getInputProps('phone')}
					/>

					<Select
						label="Category"
						placeholder="Select dealer category"
						required
						data={[
							{ value: 'wakanet', label: 'Wakanet' },
							{ value: 'enterprise', label: 'Enterprise' },
							{ value: 'both', label: 'Both' },
						]}
						{...form.getInputProps('category')}
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
						<Button type="submit">Add Dealer</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
