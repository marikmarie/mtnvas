import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconEye, IconPower, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { AddDealerModal } from './AddDealerModal';
import { AddDealerUserModal } from './AddDealerUserModal';
import { ConfirmationModal } from './ConfirmationModal';
import { EditDealerModal } from './EditDealerModal';
import { Dealer } from './types';
import { ViewDealerModal } from './ViewDealerModal';

export function DealerList() {
	const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
	const [addUserType, setAddUserType] = useState<'DSA' | 'Retailer' | null>(null);

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
	const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
	const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
	const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] =
		useDisclosure(false);
	const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | 'delete'>(
		'activate'
	);

	const handleAction = (
		dealer: Dealer,
		action: 'edit' | 'view' | 'activate' | 'deactivate' | 'delete'
	) => {
		setSelectedDealer(dealer);
		switch (action) {
			case 'edit':
				openEditModal();
				break;
			case 'view':
				openViewModal();
				break;
			case 'activate':
			case 'deactivate':
			case 'delete':
				setConfirmAction(action);
				openConfirmModal();
				break;
		}
	};

	const request = useRequest(true);

	const { data: dealers, isLoading } = useQuery({
		queryFn: () => request.get('/dealer-groups'),
		queryKey: ['dealers'],
	});

	const handleAddUser = (dealer: Dealer, userType: 'DSA' | 'Retailer') => {
		setSelectedDealer(dealer);
		setAddUserType(userType);
	};

	const columns = [
		{ name: 'companyName', header: 'COMPANY NAME', defaultFlex: 1 },
		{ name: 'contactPerson', header: 'CONTACT PERSON', defaultFlex: 1 },
		{ name: 'email', header: 'EMAIL', defaultFlex: 1 },
		{ name: 'msisdn', header: 'MSISDN', defaultFlex: 1 },
		{ name: 'department', header: 'DEPARTMENT', defaultFlex: 1 },
		{
			name: 'status',
			header: 'STATUS',
			defaultFlex: 1,
			render: ({ data }: { data: Dealer }) => (
				<Text color={data.status === 'active' ? 'green' : 'red'}>
					{data.status?.charAt(0)?.toUpperCase() + data.status?.slice(1)}
				</Text>
			),
		},
		{
			name: 'actions',
			header: 'ACTIONS',
			defaultFlex: 1.2,
			render: ({ data }: { data: Dealer }) => (
				<Group
					spacing="xs"
					position="left"
					noWrap
				>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="Add DSA"
						onClick={() => handleAddUser(data, 'DSA')}
					>
						<IconUserPlus
							size={16}
							color="#228be6"
						/>
						DSA
					</Button>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="Add Retailer"
						onClick={() => handleAddUser(data, 'Retailer')}
					>
						<IconUserPlus
							size={16}
							color="#40c057"
						/>
						Retailer
					</Button>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="View Details"
						onClick={() => handleAction(data, 'view')}
					>
						<IconEye
							size={16}
							color="#228be6"
						/>
					</Button>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="Edit"
						onClick={() => handleAction(data, 'edit')}
					>
						<IconEdit
							size={16}
							color="#40c057"
						/>
					</Button>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title={data.status === 'active' ? 'Deactivate' : 'Activate'}
						onClick={() =>
							handleAction(data, data.status === 'active' ? 'deactivate' : 'activate')
						}
					>
						<IconPower
							size={16}
							color={data.status === 'active' ? '#fa5252' : '#40c057'}
						/>
					</Button>
					<Button
						variant="subtle"
						size="xs"
						p={0}
						title="Delete"
						onClick={() => handleAction(data, 'delete')}
					>
						<IconTrash
							size={16}
							color="#fa5252"
						/>
					</Button>
				</Group>
			),
		},
	];

	const table = useDataGridTable({
		columns,
		data: dealers?.data?.data || [],
		loading: isLoading,
	});

	return (
		<Stack>
			<Flex justify="flex-end">
				<Button onClick={openAddModal}>Add New Dealer</Button>
			</Flex>

			{table}

			<AddDealerModal
				opened={addModalOpened}
				onClose={closeAddModal}
			/>

			{selectedDealer && (
				<>
					<EditDealerModal
						opened={editModalOpened}
						onClose={closeEditModal}
						dealer={selectedDealer}
					/>

					<ViewDealerModal
						opened={viewModalOpened}
						onClose={closeViewModal}
						dealer={selectedDealer}
					/>

					<ConfirmationModal
						opened={confirmModalOpened}
						onClose={closeConfirmModal}
						action={confirmAction}
						dealer={selectedDealer}
					/>
				</>
			)}

			{selectedDealer && addUserType && (
				<AddDealerUserModal
					opened={!!addUserType}
					onClose={() => setAddUserType(null)}
					dealer={selectedDealer}
					userType={addUserType}
				/>
			)}
		</Stack>
	);
}
