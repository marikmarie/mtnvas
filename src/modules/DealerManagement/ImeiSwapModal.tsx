import { Button, Group, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';

interface ImeiSwapModalProps {
	opened: boolean;
	onClose: () => void;
	oldImei: string;
}

interface ImeiSwapFormValues {
	newImei: string;
	reason: string;
}

export function ImeiSwapModal({ opened, onClose, oldImei }: ImeiSwapModalProps) {
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ImeiSwapFormValues>({
		initialValues: {
			newImei: '',
			reason: '',
		},
		validate: {
			newImei: (value) => (!value ? 'New IMEI is required' : null),
			reason: (value) => (!value ? 'Reason is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ImeiSwapFormValues) => {
			return request.post('/imei-swaps', {
				oldImei,
				...values,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['imeis'] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ImeiSwapFormValues) => {
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
						label="Old IMEI"
						value={oldImei}
						disabled
					/>

					<TextInput
						label="New IMEI"
						placeholder="Enter new IMEI"
						required
						{...form.getInputProps('newImei')}
					/>

					<Textarea
						label="Reason for Swap"
						placeholder="Enter reason for swapping IMEI"
						required
						minRows={3}
						{...form.getInputProps('reason')}
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
							Swap IMEI
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
