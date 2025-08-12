import { Modal, Tabs, Paper, Stack } from '@mantine/core';
import { IconUserPlus, IconUsers } from '@tabler/icons-react';
import Adduser from './Adduser';
import ListUsers from './ListUsers';

interface UserManagementModalProps {
	opened: boolean;
	onClose: () => void;
}

export default function UserManagementModal({ opened, onClose }: UserManagementModalProps) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="User Management"
			size="lg"
			overlayProps={{ opacity: 0.5, blur: 4 }}
			centered
		>
			<Tabs defaultValue="add">
				<Tabs.List grow>
					<Tabs.Tab
						value="add"
						icon={<IconUserPlus size={16} />}
					>
						Add User
					</Tabs.Tab>
					<Tabs.Tab
						value="list"
						icon={<IconUsers size={16} />}
					>
						View Users
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel
					value="add"
					pt="md"
				>
					<Paper
						withBorder
						p="md"
					>
						<Adduser />
					</Paper>
				</Tabs.Panel>

				<Tabs.Panel
					value="list"
					pt="md"
				>
					<Stack>
						<ListUsers />
					</Stack>
				</Tabs.Panel>
			</Tabs>
		</Modal>
	);
}
