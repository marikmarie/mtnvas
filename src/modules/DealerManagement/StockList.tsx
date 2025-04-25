import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Stock } from './types';
import { AddStockModal } from './AddStockModal';
import { SetStockThresholdModal } from './SetStockThresholdModal';
import { IconAdjustments } from '@tabler/icons-react';

// Generate fake stock data for demonstration
const generateFakeStock = (count: number): Stock[] => {
	return Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		dealerId: faker.string.uuid(),
		dealerName: faker.company.name(),
		productId: faker.string.uuid(),
		productName: faker.commerce.productName(),
		deviceId: faker.string.uuid(),
		deviceName: faker.commerce.productName(),
		category: faker.helpers.arrayElement(['wakanet', 'enterprise', 'both']),
		imeiFile: faker.system.filePath(),
		quantity: faker.number.int({ min: 10, max: 1000 }),
		createdAt: faker.date.past().toISOString(),
	}));
};

export function StockList() {
	const [stock] = useState<Stock[]>(generateFakeStock(30));
	const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

	// Modal states
	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [thresholdModalOpened, { open: openThresholdModal, close: closeThresholdModal }] =
		useDisclosure(false);

	const handleSetThreshold = (stockItem: Stock) => {
		setSelectedStock(stockItem);
		openThresholdModal();
	};

	const columns = [
		{ name: 'dealerName', header: 'Dealer', defaultFlex: 1 },
		{ name: 'productName', header: 'Product', defaultFlex: 1 },
		{ name: 'deviceName', header: 'Device', defaultFlex: 1 },
		{ name: 'category', header: 'Category', defaultFlex: 1 },
		{
			name: 'quantity',
			header: 'Quantity',
			defaultFlex: 1,
			render: ({ data }: { data: Stock }) => (
				<Text weight={500}>{data.quantity.toLocaleString()}</Text>
			),
		},
		{
			name: 'createdAt',
			header: 'Created At',
			defaultFlex: 1,
			render: ({ data }: { data: Stock }) => (
				<Text>{new Date(data.createdAt).toLocaleDateString()}</Text>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 0.5,
			render: ({ data }: { data: Stock }) => (
				<Group
					spacing="xs"
					position="left"
					noWrap
				>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="Set Threshold"
						onClick={() => handleSetThreshold(data)}
					>
						<IconAdjustments
							size={16}
							color="#228be6"
						/>
					</Button>
				</Group>
			),
		},
	];

	const table = useDataGridTable({
		columns,
		data: stock,
		loading: false,
	});

	return (
		<Stack>
			<Flex justify="flex-end">
				<Button onClick={openAddModal}>Add Stock</Button>
			</Flex>

			{table}

			<AddStockModal
				opened={addModalOpened}
				onClose={closeAddModal}
			/>

			{selectedStock && (
				<SetStockThresholdModal
					opened={thresholdModalOpened}
					onClose={closeThresholdModal}
				/>
			)}
		</Stack>
	);
}
