import { Button, FileInput, Group, Select, Stack, Title } from '@mantine/core';
import { Modal } from '../../components/Modal';
import { StockModalProps } from './types';
import { useForm } from '@mantine/form';
import { faker } from '@faker-js/faker';

// Simulated data for dropdowns (replace with actual API calls)
const getDealers = () => {
	return Array.from({ length: 10 }, () => ({
		value: faker.string.uuid(),
		label: faker.company.name(),
	}));
};

const getProducts = (_category?: string) => {
	return Array.from({ length: 5 }, () => ({
		value: faker.string.uuid(),
		label: faker.commerce.productName(),
	}));
};

const getDevices = (_category?: string) => {
	return Array.from({ length: 3 }, () => ({
		value: faker.string.uuid(),
		label: faker.commerce.productName(),
	}));
};

export function AddStockModal({ opened, onClose }: StockModalProps) {
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

	const handleSubmit = form.onSubmit((values) => {
		console.log('Add stock:', values);
		// Here you would typically make an API call to add the stock
		// The IMEI file would be uploaded to the server
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
				<Title order={3}>Add Stock</Title>

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

						<FileInput
							label="IMEI File"
							// @ts-ignore
							placeholder="Upload IMEI file"
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
							<Button type="submit">Add Stock</Button>
						</Group>
					</Stack>
				</form>
			</Stack>
		</Modal>
	);
}
