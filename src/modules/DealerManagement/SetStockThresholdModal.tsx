import { Button, Group, NumberInput, Select, Stack, Title } from '@mantine/core';
import { Modal } from '../../components/Modal';
import { StockThresholdModalProps } from './types';
import { useForm } from '@mantine/form';
import { faker } from '@faker-js/faker';

// Simulated data for dropdowns (replace with actual API calls)
const getDealers = () => {
	return Array.from({ length: 10 }, () => ({
		value: faker.string.uuid(),
		label: faker.company.name(),
	}));
};

const getProducts = (category?: string) => {
	return Array.from({ length: 5 }, () => ({
		value: faker.string.uuid(),
		label: faker.commerce.productName(),
	}));
};

const getDevices = (category?: string) => {
	return Array.from({ length: 3 }, () => ({
		value: faker.string.uuid(),
		label: faker.commerce.productName(),
	}));
};

export function SetStockThresholdModal({ opened, onClose }: StockThresholdModalProps) {
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

	const handleSubmit = form.onSubmit((values) => {
		console.log('Set threshold:', values);
		// Here you would typically make an API call to set the threshold
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
				<Title order={3}>Set Stock Threshold</Title>

				<form onSubmit={handleSubmit}>
					<Stack>
						<Select
							label="Dealer"
							placeholder="Select dealer"
							required
							data={getDealers()}
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
							data={getProducts(form.values.category)}
							searchable
							nothingFound="No products found"
							disabled={!form.values.category}
							{...form.getInputProps('productId')}
						/>

						<Select
							label="Device"
							placeholder="Select device"
							required
							data={getDevices(form.values.category)}
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
							<Button type="submit">Set Threshold</Button>
						</Group>
					</Stack>
				</form>
			</Stack>
		</Modal>
	);
}
