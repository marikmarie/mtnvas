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
		},
		validate: {
			companyName: (value) => (!value ? 'Company name is required' : null),
			contactPerson: (value) => (!value ? 'Contact person is required' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			msisdn: (value) => {
				if (!value) return 'MSISDN is required';
				if (!/^256\d{9}$/.test(value))
					return 'Phone number must start with 256 followed by 9 digits';
				return null;
			},
			department: (value) => (!value ? 'Department is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: () => request.post('/dealer-groups', form.values),
		mutationKey: ['dealers'],
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
						placeholder="Enter phone number (e.g., 256123456789)"
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
							Add Dealer
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
