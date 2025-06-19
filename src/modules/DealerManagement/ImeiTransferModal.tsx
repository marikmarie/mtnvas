import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface ImeiTransferModalProps {
	opened: boolean;
	onClose: () => void;
	imei: string;
	fromDealer: Dealer;
	dealers: Dealer[];
}

interface ImeiTransferFormValues {
	toDealerId: string;
	toProductId: string;
}

export function ImeiTransferModal({
	opened,
	onClose,
	imei,
	fromDealer,
	dealers,
}: ImeiTransferModalProps) {
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ImeiTransferFormValues>({
		initialValues: {
			toDealerId: '',
			toProductId: '',
		},
		validate: {
			toDealerId: (value) => (!value ? 'Target dealer is required' : null),
			toProductId: (value) => (!value ? 'Target product is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ImeiTransferFormValues) => {
			return request.post('/imei-transfers', {
				imei,
				fromDealerId: fromDealer?.id,
				...values,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['imeis'] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ImeiTransferFormValues) => {
		mutation.mutate(values);
	};

	const dealerOptions = dealers
		.filter((dealer) => dealer?.id !== fromDealer?.id)
		.map((dealer) => ({
			value: dealer?.id,
			label: dealer?.name,
		}));

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack spacing="md">
					<TextInput
						label="IMEI"
						value={imei}
						disabled
					/>

					<TextInput
						label="From Dealer"
						value={fromDealer?.name}
						disabled
					/>

					<Select
						label="To Dealer"
						placeholder="Select target dealer"
						required
						data={dealerOptions}
						{...form.getInputProps('toDealerId')}
					/>

					<Select
						label="To Product"
						placeholder="Select target product"
						required
						data={[
							{ value: 'product1', label: 'Product 1' },
							{ value: 'product2', label: 'Product 2' },
							{ value: 'product3', label: 'Product 3' },
						]}
						{...form.getInputProps('toProductId')}
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
							Transfer IMEI
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
