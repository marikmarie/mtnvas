import { Button, Group, Stack, Text } from '@mantine/core';
import { Modal } from '../../components/Modal';
import { Dealer } from './types';

interface ConfirmationModalProps {
	opened: boolean;
	onClose: () => void;
	action: 'activate' | 'deactivate' | 'delete';
	dealer: Dealer;
}

export function ConfirmationModal({ opened, onClose, action, dealer }: ConfirmationModalProps) {
	const getActionColor = () => {
		switch (action) {
			case 'activate':
				return 'green';
			case 'deactivate':
			case 'delete':
				return 'red';
			default:
				return 'blue';
		}
	};

	const getActionText = () => {
		switch (action) {
			case 'activate':
				return 'activate';
			case 'deactivate':
				return 'deactivate';
			case 'delete':
				return 'delete';
			default:
				return '';
		}
	};

	const handleConfirm = () => {
		console.log(`Confirmed ${action} for dealer:`, dealer);
		// Here you would typically make an API call to perform the action
		onClose();
	};

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="sm"
		>
			<Stack spacing="md">
				<Text
					size="lg"
					weight={500}
				>
					Confirm Action
				</Text>

				<Text>
					Are you sure you want to {getActionText()} the dealer "{dealer.name}"?
				</Text>

				<Text
					size="sm"
					color="dimmed"
				>
					This action {action === 'delete' ? 'cannot' : 'can'} be undone.
				</Text>

				<Group
					position="right"
					mt="md"
				>
					<Button
						variant="subtle"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						color={getActionColor()}
						onClick={handleConfirm}
					>
						{action.charAt(0).toUpperCase() + action.slice(1)}
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
}
