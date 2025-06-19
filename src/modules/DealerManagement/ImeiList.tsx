import { Button, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { ImeiSwapModal } from './ImeiSwapModal';
import { ImeiTransferModal } from './ImeiTransferModal';
import { Dealer, Imei } from './types';

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

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/dealers'),
	});

	const handleOpenTransfer = (imei: Imei) => {
		if (imei?.imei) {
			setSelectedImei(imei);
			openTransferModal();
		}
	};

	const handleOpenSwap = (imei: Imei) => {
		if (imei?.imei) {
			setSelectedImei(imei);
			openSwapModal();
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
			{table}
			<ImeiTransferModal
				opened={transferModalOpened}
				onClose={closeTransferModal}
				imei={selectedImei?.imei || ''}
				fromDealer={
					dealersData?.data?.data?.find((d: Dealer) => d.id === selectedImei!.soldById)!
				}
				dealers={dealersData?.data?.data || []}
			/>
			<ImeiSwapModal
				opened={swapModalOpened}
				onClose={closeSwapModal}
				oldImei={selectedImei?.imei || ''}
			/>
		</Stack>
	);
}
