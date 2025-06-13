import { Button, Flex, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { AddStockModal } from './AddStockModal';
import { SetStockThresholdModal } from './SetStockThresholdModal';
import { Stock } from './types';

export function StockList() {
	const request = useRequest(true);
	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [thresholdModalOpened, { open: openThresholdModal, close: closeThresholdModal }] =
		useDisclosure(false);

	const { data: stockData, isLoading } = useQuery({
		queryKey: ['stocks'],
		queryFn: () => request.get('/stocks'),
	});

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
			name: 'sold',
			header: 'Sold',
			defaultFlex: 1,
			render: ({ data }: { data: Stock }) => (
				<Text weight={500}>{data.sold.toLocaleString()}</Text>
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
	];

	const table = useDataGridTable({
		columns,
		data: stockData?.data?.data || [],
		loading: isLoading,
	});

	return (
		<Stack>
			<Flex
				justify="flex-end"
				gap="md"
			>
				<Button onClick={openAddModal}>Add Stock</Button>
				<Button
					variant="outline"
					onClick={openThresholdModal}
				>
					Set Stock Threshold
				</Button>
			</Flex>

			{table}

			<AddStockModal
				opened={addModalOpened}
				onClose={closeAddModal}
			/>

			<SetStockThresholdModal
				opened={thresholdModalOpened}
				onClose={closeThresholdModal}
			/>
		</Stack>
	);
}
