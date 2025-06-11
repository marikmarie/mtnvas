import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPower, IconUserPlus } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { AddShopModal } from './AddShopModal';
import { AddShopUserModal } from './AddShopUserModal';
import { Shop } from './types';

export function ShopList() {
	const request = useRequest(true);
	const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

	// Modal states
	const [addShopModalOpened, { open: openAddShopModal, close: closeAddShopModal }] =
		useDisclosure(false);
	const [addUserModalOpened, { open: openAddUserModal, close: closeAddUserModal }] =
		useDisclosure(false);

	const { data: shopsData, isLoading } = useQuery({
		queryKey: ['shops'],
		queryFn: () => request.get('/shops'),
	});

	const approvalMutation = useMutation({
		mutationFn: ({ shopId, status }: { shopId: string; status: 'approved' | 'rejected' }) =>
			request.post(`/shops/${shopId}/approval?status=${status}`),
	});

	const handleAddShopAgent = (shop: Shop) => {
		setSelectedShop(shop);
		openAddUserModal();
	};

	const columns = [
		{
			name: 'shopName',
			header: 'Shop Name',
			defaultFlex: 1,
			render: ({ data }: { data: Shop }) => data.shopName?.toUpperCase() || '-',
		},
		{
			name: 'location',
			header: 'Location',
			defaultFlex: 1,
			render: ({ data }: { data: Shop }) => data.location?.toUpperCase() || '-',
		},
		{
			name: 'region',
			header: 'Region',
			defaultFlex: 1,
			render: ({ data }: { data: Shop }) => data.region?.toUpperCase() || '-',
		},
		{
			name: 'dealerName',
			header: 'Dealer',
			defaultFlex: 1,
			render: ({ data }: { data: Shop }) => data.dealerName?.toUpperCase() || '-',
		},
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			render: ({ data }: { data: Shop }) => (
				<Text
					color={data.status === 'active' ? 'green' : 'red'}
					transform="capitalize"
				>
					{data.status.toUpperCase()}
				</Text>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			render: ({ data }: { data: Shop }) => (
				<Group
					spacing="xs"
					position="left"
					noWrap
				>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="Add Shop Agent"
						onClick={() => handleAddShopAgent(data)}
					>
						<IconUserPlus
							size={16}
							color="#fab005"
						/>
					</Button>
					{data.status === 'inactive' && (
						<Group
							spacing="xs"
							noWrap
						>
							<Button
								variant="subtle"
								size="xs"
								p={0}
								title="Approve"
								onClick={() =>
									approvalMutation.mutate({
										shopId: data.shopName,
										status: 'approved',
									})
								}
								loading={approvalMutation.isLoading}
							>
								<IconPower
									size={16}
									color="#40c057"
								/>
							</Button>
							<Button
								variant="subtle"
								size="xs"
								p={0}
								title="Reject"
								onClick={() =>
									approvalMutation.mutate({
										shopId: data.shopName,
										status: 'rejected',
									})
								}
								loading={approvalMutation.isLoading}
							>
								<IconPower
									size={16}
									color="#fa5252"
								/>
							</Button>
						</Group>
					)}
				</Group>
			),
		},
	];

	const table = useDataGridTable({
		columns,
		data: shopsData?.data?.data || [],
		loading: isLoading,
	});

	return (
		<Stack>
			<Flex justify="flex-end">
				<Button onClick={openAddShopModal}>Add New Shop</Button>
			</Flex>

			{table}

			<AddShopModal
				opened={addShopModalOpened}
				onClose={closeAddShopModal}
			/>

			{selectedShop && (
				<AddShopUserModal
					opened={addUserModalOpened}
					onClose={closeAddUserModal}
					shop={selectedShop}
					userType="ShopAgent"
				/>
			)}
		</Stack>
	);
}
