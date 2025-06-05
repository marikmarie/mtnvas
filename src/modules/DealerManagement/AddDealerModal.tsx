import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { DealerModalProps } from './types';

export function AddDealerModal({ opened, onClose }: DealerModalProps) {
	const request = useRequest(true);

	const form = useForm({
		initialValues: {
			companyName: '',
			contactPerson: '',
			email: '',
			msisdn: '',
			department: '',
			status: '',
		},
		validate: {
			companyName: (value) => (!value ? 'Company name is required' : null),
			contactPerson: (value) => (!value ? 'Contact person is required' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			msisdn: (value) => (!value ? 'MSISDN is required' : null),
			department: (value) => (!value ? 'Department is required' : null),
			status: (value) => (!value ? 'Status is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: () =>
			request.post('/dealer-groups', {
				...form.values,
			}),
		mutationKey: ['dealers'],
	});

	const handleSubmit = form.onSubmit(async () => {
		await mutation.mutateAsync();
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
						{...form.getInputProps('companyName')}
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
						{...form.getInputProps('msisdn')}
					/>

					<Select
						label="Department"
						placeholder="Select dealer department"
						required
						data={[
							{ value: 'wakanet', label: 'Wakanet' },
							{ value: 'office', label: 'Office' },
						]}
						{...form.getInputProps('department')}
					/>

					<Select
						label="Status"
						placeholder="Select the status"
						required
						data={[
							{ value: 'active', label: 'Active' },
							{ value: 'inactive', label: 'Inactive' },
						]}
						{...form.getInputProps('status')}
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
