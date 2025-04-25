import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { Modal } from '../../components/Modal';
import { ShopModalProps } from './types';
import { useForm } from '@mantine/form';
import { faker } from '@faker-js/faker';

// Simulated dealer data for the dropdown
const getDealers = () => {
	return Array.from({ length: 10 }, () => ({
		value: faker.string.uuid(),
		label: faker.company.name(),
	}));
};

// Simulated regions
const regions = ['Central', 'Eastern', 'Northern', 'Western', 'Southern'].map((region) => ({
	value: region.toLowerCase(),
	label: region,
}));

export function AddShopModal({ opened, onClose }: ShopModalProps) {
	const form = useForm({
		initialValues: {
			name: '',
			location: '',
			region: '',
			dealerId: '',
		},
		validate: {
			name: (value) => (!value ? 'Shop name is required' : null),
			location: (value) => (!value ? 'Location is required' : null),
			region: (value) => (!value ? 'Region is required' : null),
			dealerId: (value) => (!value ? 'Dealer is required' : null),
		},
	});

	const handleSubmit = form.onSubmit((values) => {
		console.log('Add shop:', values);
		// Here you would typically make an API call to create the shop
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
						label="Shop Name"
						placeholder="Enter shop name"
						required
						{...form.getInputProps('name')}
					/>

					<TextInput
						label="Location"
						placeholder="Enter shop location"
						required
						{...form.getInputProps('location')}
					/>

					<Select
						label="Region"
						placeholder="Select region"
						required
						data={regions}
						{...form.getInputProps('region')}
					/>

					<Select
						label="Dealer"
						placeholder="Select dealer"
						required
						data={getDealers()}
						searchable
						nothingFound="No dealers found"
						{...form.getInputProps('dealerId')}
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
						<Button type="submit">Add Shop</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
