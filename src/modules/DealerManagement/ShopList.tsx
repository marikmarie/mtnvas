import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import { IconPower, IconUserPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Shop } from './types';
import { AddShopModal } from './AddShopModal';
import { AddShopUserModal } from './AddShopUserModal';

// Generate fake shops for demonstration
const generateFakeShops = (count: number): Shop[] => {
	return Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		name: faker.company.name(),
		location: faker.location.city(),
		region: faker.helpers.arrayElement([
			'central',
			'eastern',
			'northern',
			'western',
			'southern',
		]),
		dealerId: faker.string.uuid(),
		dealerName: faker.company.name(),
		status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
		createdAt: faker.date.past().toISOString(),
	}));
};

export function ShopList() {
	const [shops] = useState<Shop[]>(generateFakeShops(30));
	const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

	// Modal states
	const [addShopModalOpened, { open: openAddShopModal, close: closeAddShopModal }] =
		useDisclosure(false);
	const [addUserModalOpened, { open: openAddUserModal, close: closeAddUserModal }] =
		useDisclosure(false);

	const handleAddShopAgent = (shop: Shop) => {
		setSelectedShop(shop);
		openAddUserModal();
	};

	const columns = [
		{ name: 'name', header: 'Shop Name', defaultFlex: 1 },
		{ name: 'location', header: 'Location', defaultFlex: 1 },
		{ name: 'region', header: 'Region', defaultFlex: 1 },
		{ name: 'dealerName', header: 'Dealer', defaultFlex: 1 },
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			render: ({ data }: { data: Shop }) => (
				<Text
					color={
						data.status === 'approved'
							? 'green'
							: data.status === 'rejected'
								? 'red'
								: 'orange'
					}
					transform="capitalize"
				>
					{data.status}
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
					{data.status === 'pending' && (
						<Group
							spacing="xs"
							noWrap
						>
							<Button
								variant="subtle"
								size="xs"
								p={0}
								title="Approve"
								onClick={() => console.log('Approve shop:', data)}
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
								onClick={() => console.log('Reject shop:', data)}
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
		data: shops,
		loading: false,
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
