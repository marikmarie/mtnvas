import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import { IconEdit, IconEye, IconPower, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { EditDealerModal } from './EditDealerModal';
import { ViewDealerModal } from './ViewDealerModal';
import { ConfirmationModal } from './ConfirmationModal';
import { AddDealerModal } from './AddDealerModal';
import { Dealer } from './types';

// Generate fake dealers for demonstration
const generateFakeDealers = (count: number): Dealer[] => {
	return Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		name: faker.company.name(),
		contactPerson: faker.person.fullName(),
		email: faker.internet.email(),
		phone: faker.phone.number({ style: 'national' }),
		category: faker.helpers.arrayElement(['wakanet', 'enterprise', 'both']),
		createdAt: faker.date.past().toISOString(),
		status: faker.helpers.arrayElement(['active', 'inactive']),
	}));
};

export function DealerList() {
	const [dealers] = useState<Dealer[]>(generateFakeDealers(50));
	const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

	// Modal states
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

	const columns = [
		{ name: 'name', header: 'Company Name', defaultFlex: 1 },
		{ name: 'contactPerson', header: 'Contact Person', defaultFlex: 1 },
		{ name: 'email', header: 'Email', defaultFlex: 1 },
		{ name: 'phone', header: 'Phone', defaultFlex: 1 },
		{ name: 'category', header: 'Category', defaultFlex: 1 },
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			render: ({ data }: { data: Dealer }) => (
				<Text color={data.status === 'active' ? 'green' : 'red'}>
					{data.status.charAt(0).toUpperCase() + data.status.slice(1)}
				</Text>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 0.8,
			render: ({ data }: { data: Dealer }) => (
				<Group
					spacing="xs"
					position="center"
					noWrap
				>
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
		data: dealers,
		loading: false,
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
		</Stack>
	);
}
