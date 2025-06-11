import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { ShopModalProps } from './types';

const regions = ['Central', 'Eastern', 'Northern', 'Western'].map((region) => ({
	value: region.toLowerCase(),
	label: region,
}));

export function AddShopModal({ opened, onClose }: ShopModalProps) {
	const request = useRequest(true);
	const user = useSelector((state: RootState) => state.auth.user);

	const form = useForm({
		initialValues: {
			shopName: '',
			location: '',
			region: '',
			dealerName: '',
			status: 'active',
		},
		validate: {
			shopName: (value) => (!value ? 'Shop name is required' : null),
			location: (value) => (!value ? 'Location is required' : null),
			region: (value) => (!value ? 'Region is required' : null),
			dealerName: (value) => (!value ? 'Dealer is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: () =>
			request.post('/shops', {
				...form.values,
				createdBy: user?.email,
				createdAt: new Date().toISOString(),
			}),
	});

	const handleSubmit = form.onSubmit(() => {
		mutation.mutate();
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
						{...form.getInputProps('shopName')}
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

					<TextInput
						label="Dealer Name"
						placeholder="Enter dealer name"
						required
						{...form.getInputProps('dealerName')}
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
							Add Shop
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
