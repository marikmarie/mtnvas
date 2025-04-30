import { useState, useEffect } from 'react';
import { Modal, Button, Select, Stack, Group, Text } from '@mantine/core';
import { faker } from '@faker-js/faker';
import { Dealer, Product, Imei } from './types';
import { showNotification } from '@mantine/notifications';

interface ImeiTransferModalProps {
	opened: boolean;
	onClose: () => void;
	imei: Imei | null;
	onTransfer: (data: any) => Promise<void>;
}

const generateFakeDealers = (count: number): Dealer[] =>
	Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		name: faker.company.name(),
		contactPerson: faker.person.fullName(),
		email: faker.internet.email(),
		phone: faker.phone.number(),
		category: faker.helpers.arrayElement(['wakanet', 'enterprise', 'both']),
		createdAt: faker.date.past().toISOString(),
		status: 'active',
	}));

const generateFakeProducts = (count: number): Product[] =>
	Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		name: faker.commerce.productName(),
		category: faker.helpers.arrayElement(['wakanet', 'enterprise', 'both']),
	}));

export function ImeiTransferModal({ opened, onClose, imei, onTransfer }: ImeiTransferModalProps) {
	const [dealers] = useState<Dealer[]>(generateFakeDealers(10));
	const [products] = useState<Product[]>(generateFakeProducts(10));
	const [fromDealer, setFromDealer] = useState<string | null>(null);
	const [fromProduct, setFromProduct] = useState<string | null>(null);
	const [toDealer, setToDealer] = useState<string | null>(null);
	const [toProduct, setToProduct] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setFromDealer(null);
		setFromProduct(null);
		setToDealer(null);
		setToProduct(null);
	}, [opened, imei]);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const response = await fetch('/api/imei/transfer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					imei: imei?.imei,
					fromDealer,
					fromProduct,
					toDealer,
					toProduct,
				}),
			});
			if (!response.ok) throw new Error('Transfer failed');
			showNotification({
				color: 'green',
				title: 'Success',
				message: 'IMEI transferred successfully!',
			});
			await onTransfer({ imei, fromDealer, fromProduct, toDealer, toProduct });
			onClose();
		} catch (e: any) {
			showNotification({
				color: 'red',
				title: 'Error',
				message: e.message || 'Transfer failed',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Transfer IMEI${imei ? `: ${imei.imei}` : ''}`}
			centered
		>
			<Stack>
				<Text
					size="sm"
					color="dimmed"
				>
					Select transfer details:
				</Text>
				<Group grow>
					<Select
						label="From Dealer"
						placeholder="Pick dealer"
						data={dealers.map((d) => ({ value: d.id, label: d.name }))}
						value={fromDealer}
						onChange={setFromDealer}
						searchable
					/>
					<Select
						label="Product"
						placeholder="Pick product"
						data={products.map((p) => ({ value: p.id, label: p.name }))}
						value={fromProduct}
						onChange={setFromProduct}
						searchable
					/>
				</Group>
				<Group grow>
					<Select
						label="To Dealer"
						placeholder="Pick new dealer"
						data={dealers.map((d) => ({ value: d.id, label: d.name }))}
						value={toDealer}
						onChange={setToDealer}
						searchable
					/>
					<Select
						label="Proposed Product"
						placeholder="Pick new product"
						data={products.map((p) => ({ value: p.id, label: p.name }))}
						value={toProduct}
						onChange={setToProduct}
						searchable
					/>
				</Group>
				<Button
					mt="md"
					onClick={handleSubmit}
					loading={loading}
					disabled={!(fromDealer && fromProduct && toDealer && toProduct)}
				>
					Transfer
				</Button>
			</Stack>
		</Modal>
	);
}
