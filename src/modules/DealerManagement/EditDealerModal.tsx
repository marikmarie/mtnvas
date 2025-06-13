import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface EditDealerModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
}

interface DealerFormValues {
	name: string;
	contactPerson: string;
	email: string;
	phone: string;
	category: 'wakanet' | 'enterprise' | 'both';
}

export function EditDealerModal({ opened, onClose, dealer }: EditDealerModalProps) {
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<DealerFormValues>({
		initialValues: {
			name: dealer.name,
			contactPerson: dealer.contactPerson,
			email: dealer.email,
			phone: dealer.phone,
			category: dealer.category,
		},
		validate: {
			name: (value) => (!value ? 'Dealer name is required' : null),
			contactPerson: (value) => (!value ? 'Contact person is required' : null),
			email: (value) => (!value ? 'Email is required' : null),
			phone: (value) => (!value ? 'Phone number is required' : null),
			category: (value) => (!value ? 'Category is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: DealerFormValues) => {
			return request.put(`/dealer-groups/${dealer.id}`, values);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dealer', dealer.id] });
			onClose();
		},
	});

	const handleSubmit = (values: DealerFormValues) => {
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
						label="Dealer Name"
						placeholder="Enter dealer name"
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
						label="Category"
						placeholder="Select category"
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
						<Button
							type="submit"
							loading={mutation.isLoading}
						>
							Save Changes
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
