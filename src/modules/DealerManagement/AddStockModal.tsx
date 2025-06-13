import { Button, FileInput, Group, Select, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { StockModalProps } from './types';

export function AddStockModal({ opened, onClose }: StockModalProps) {
	const request = useRequest(true);

	const { data: dealers } = useQuery({
		queryKey: ['dealers/list'],
		queryFn: () => request.get('/dealers/list'),
	});

	const { data: products } = useQuery({
		queryKey: ['products'],
		queryFn: () => request.get('/products'),
	});

	const { data: devices } = useQuery({
		queryKey: ['devices'],
		queryFn: () => request.get('/devices'),
	});

	const form = useForm({
		initialValues: {
			dealerId: '',
			category: '',
			productId: '',
			deviceId: '',
			imeiFile: null as File | null,
		},
		validate: {
			dealerId: (value) => (!value ? 'Dealer is required' : null),
			category: (value) => (!value ? 'Category is required' : null),
			productId: (value) => (!value ? 'Product is required' : null),
			deviceId: (value) => (!value ? 'Device is required' : null),
			imeiFile: (value) => (!value ? 'IMEI file is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			request.post('/stocks', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}),
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit((values) => {
		const formData = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			if (value !== null) {
				formData.append(key, value);
			}
		});
		mutation.mutate(formData);
	});

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<Stack>
				<Title order={3}>Add Stock</Title>

				<form onSubmit={handleSubmit}>
					<Stack>
						<Select
							label="Dealer"
							placeholder="Select dealer"
							required
							data={dealers?.data?.data || []}
							searchable
							nothingFound="No dealers found"
							{...form.getInputProps('dealerId')}
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

						<Select
							label="Product"
							placeholder="Select product"
							required
							data={products?.data?.data || []}
							searchable
							nothingFound="No products found"
							disabled={!form.values.category}
							{...form.getInputProps('productId')}
						/>

						<Select
							label="Device"
							placeholder="Select device"
							required
							data={devices?.data?.data || []}
							searchable
							nothingFound="No devices found"
							disabled={!form.values.category}
							{...form.getInputProps('deviceId')}
						/>

						<FileInput
							label="IMEI File"
							description="Upload IMEI file"
							accept=".csv,.xlsx,.xls"
							required
							{...form.getInputProps('imeiFile')}
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
								Add Stock
							</Button>
						</Group>
					</Stack>
				</form>
			</Stack>
		</Modal>
	);
}
