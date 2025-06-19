import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPower, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { AddShopUserModal } from './AddShopUserModal';
import { ConfirmationModal } from './ConfirmationModal';
import { Shop, ShopUser } from './types';

interface ShopUsersListProps {
	shop: Shop;
}

export function ShopUsersList({ shop }: ShopUsersListProps) {
	const [selectedUser, setSelectedUser] = useState<ShopUser | null>(null);
	const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | 'delete'>(
		'activate'
	);

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] =
		useDisclosure(false);

	const request = useRequest(true);

	const { data: users, isLoading } = useQuery({
		queryFn: () => request.get(`/shops/${shop?.shopName}/users`),
		queryKey: ['shop-users', shop?.shopName],
	});

	const handleAction = (user: ShopUser, action: 'activate' | 'deactivate' | 'delete') => {
		setSelectedUser(user);
		setConfirmAction(action);
		openConfirmModal();
	};

	const columns = [
		{ name: 'name', header: 'NAME', defaultFlex: 1 },
		{ name: 'email', header: 'EMAIL', defaultFlex: 1 },
		{ name: 'msisdn', header: 'PHONE', defaultFlex: 1 },
		{ name: 'userType', header: 'ROLE', defaultFlex: 1 },
		{
			name: 'status',
			header: 'STATUS',
			defaultFlex: 1,
			render: ({ data }: { data: ShopUser }) => (
				<Text color={data.status === 'active' ? 'green' : 'red'}>
					{data.status?.charAt(0)?.toUpperCase() + data.status?.slice(1)}
				</Text>
			),
		},
		{
			name: 'actions',
			header: 'ACTIONS',
			defaultFlex: 1,
			render: ({ data }: { data: ShopUser }) => (
				<Group spacing="xs">
					<Button
						variant="subtle"
						color={data.status === 'active' ? 'red' : 'green'}
						compact
						onClick={() =>
							handleAction(data, data.status === 'active' ? 'deactivate' : 'activate')
						}
					>
						<IconPower size={16} />
					</Button>
					<Button
						variant="subtle"
						color="red"
						compact
						onClick={() => handleAction(data, 'delete')}
					>
						<IconTrash size={16} />
					</Button>
				</Group>
			),
		},
	];

	const table = useDataGridTable({
		columns,
		data: users?.data || [],
		loading: isLoading,
	});

	return (
		<Stack>
			<Flex justify="flex-end">
				<Button
					leftIcon={<IconUserPlus size={16} />}
					onClick={openAddModal}
				>
					Add User
				</Button>
			</Flex>

			{table}

			<AddShopUserModal
				opened={addModalOpened}
				onClose={closeAddModal}
				dealer={{
					id: shop?.dealerName,
					name: shop?.dealerName,
					contactPerson: '',
					email: '',
					phone: '',
					category: 'wakanet',
					createdAt: '',
					status: 'active',
				}}
				shops={[
					{
						id: shop?.shopName,
						name: shop?.shopName,
					},
				]}
			/>

			{selectedUser && (
				<ConfirmationModal
					opened={confirmModalOpened}
					onClose={closeConfirmModal}
					action={confirmAction}
					dealer={{
						id: shop?.dealerName,
						name: shop?.dealerName,
						contactPerson: '',
						email: '',
						phone: '',
						category: 'wakanet',
						createdAt: '',
						status: 'active',
					}}
				/>
			)}
		</Stack>
	);
}
