import { Button, Group, NumberInput, Select, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { StockThresholdModalProps } from './types';

export function SetStockThresholdModal({ opened, onClose }: StockThresholdModalProps) {
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
			threshold: 100,
		},
		validate: {
			dealerId: (value) => (!value ? 'Dealer is required' : null),
			category: (value) => (!value ? 'Category is required' : null),
			productId: (value) => (!value ? 'Product is required' : null),
			deviceId: (value) => (!value ? 'Device is required' : null),
			threshold: (value) => {
				if (!value) return 'Threshold is required';
				if (value < 1) return 'Threshold must be greater than 0';
				return null;
			},
		},
	});

	const mutation = useMutation({
		mutationFn: (values: typeof form.values) => request.post('/stock-thresholds', values),
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit((values) => mutation.mutate(values));

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<Stack>
				<Title order={3}>Set Stock Threshold</Title>

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

						<NumberInput
							label="Threshold"
							placeholder="Enter stock threshold"
							required
							min={1}
							{...form.getInputProps('threshold')}
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
								Set Threshold
							</Button>
						</Group>
					</Stack>
				</form>
			</Stack>
		</Modal>
	);
}
