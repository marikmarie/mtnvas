import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { ImeiSwapModal } from './ImeiSwapModal';
import { ImeiTransferModal } from './ImeiTransferModal';
import { Imei } from './types';

export function ImeiList() {
	const request = useRequest(true);
	const [selectedImei, setSelectedImei] = useState<Imei | null>(null);
	const [transferModalOpened, { open: openTransferModal, close: closeTransferModal }] =
		useDisclosure(false);
	const [swapModalOpened, { open: openSwapModal, close: closeSwapModal }] = useDisclosure(false);

	const { data: imeiData, isLoading } = useQuery({
		queryKey: ['imeis'],
		queryFn: () => request.get('/imeis'),
	});

	const handleOpenTransfer = (imei: Imei) => {
		setSelectedImei(imei);
		openTransferModal();
	};

	const handleOpenSwap = (imei: Imei) => {
		setSelectedImei(imei);
		openSwapModal();
	};

	const handleTransfer = async (transferData: any) => {
		try {
			await request.post('/imeis/transfer', transferData);
			closeTransferModal();
		} catch (error) {
			console.error('Transfer failed:', error);
		}
	};

	const handleSwap = async (swapData: any) => {
		try {
			await request.post('/imeis/swap', swapData);
			closeSwapModal();
		} catch (error) {
			console.error('Swap failed:', error);
		}
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
		data: imeiData?.data?.data || [],
		loading: isLoading,
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
