import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Imei } from './types';
import { ImeiTransferModal } from './ImeiTransferModal';
import { ImeiSwapModal } from './ImeiSwapModal';

// Generate fake IMEI data for demonstration
const generateFakeImeis = (count: number): Imei[] => {
	return Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		imei: faker.phone.imei(),
		status: faker.helpers.arrayElement(['available', 'assigned', 'active', 'inactive']),
		soldBy: faker.company.name(),
		soldById: faker.string.uuid(),
		date: faker.date.past().toISOString(),
	}));
};

export function ImeiList() {
	const [imeis, _setImeis] = useState<Imei[]>(generateFakeImeis(30));
	const [selectedImei, setSelectedImei] = useState<Imei | null>(null);
	const [transferModalOpened, { open: openTransferModal, close: closeTransferModal }] =
		useDisclosure(false);
	const [swapModalOpened, { open: openSwapModal, close: closeSwapModal }] = useDisclosure(false);

	const handleOpenTransfer = (imei: Imei) => {
		setSelectedImei(imei);
		openTransferModal();
	};

	const handleOpenSwap = (imei: Imei) => {
		setSelectedImei(imei);
		openSwapModal();
	};

	const handleTransfer = async (transferData: any) => {
		console.log(transferData);
		// TODO: Call backend API for transfer
		closeTransferModal();
	};

	const handleSwap = async (swapData: any) => {
		console.log(swapData);
		// TODO: Call backend API for swap
		closeSwapModal();
	};

	const columns = [
		{ name: 'imei', header: 'IMEI', defaultFlex: 1 },
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			render: ({ data }: { data: Imei }) => (
				<Text
					color={
						data.status === 'available'
							? 'green'
							: data.status === 'active'
								? 'blue'
								: data.status === 'assigned'
									? 'orange'
									: 'red'
					}
				>
					{data.status}
				</Text>
			),
		},
		{ name: 'soldBy', header: 'Sold By', defaultFlex: 1 },
		{
			name: 'date',
			header: 'Date',
			defaultFlex: 1,
			render: ({ data }: { data: Imei }) => (
				<Text>{new Date(data.date).toLocaleDateString()}</Text>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			render: ({ data }: { data: Imei }) => (
				<Group
					spacing="xs"
					position="left"
					noWrap
				>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="Transfer IMEI"
						onClick={() => handleOpenTransfer(data)}
					>
						Transfer
					</Button>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="Swap IMEI"
						onClick={() => handleOpenSwap(data)}
					>
						Swap
					</Button>
				</Group>
			),
		},
	];

	const table = useDataGridTable({
		columns,
		data: imeis,
		loading: false,
	});

	return (
		<Stack>
			<Flex justify="flex-end">{/* Add any additional actions here if needed */}</Flex>
			{table}
			<ImeiTransferModal
				opened={transferModalOpened}
				onClose={closeTransferModal}
				imei={selectedImei}
				onTransfer={handleTransfer}
			/>
			<ImeiSwapModal
				opened={swapModalOpened}
				onClose={closeSwapModal}
				imei={selectedImei}
				onSwap={handleSwap}
			/>
		</Stack>
	);
}
