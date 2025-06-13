import { Button, Group, Stack, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface ConfirmationModalProps {
	opened: boolean;
	onClose: () => void;
	action: 'activate' | 'deactivate' | 'delete';
	dealer: Dealer;
}

export function ConfirmationModal({ opened, onClose, action, dealer }: ConfirmationModalProps) {
	const request = useRequest(true);

	const mutation = useMutation({
		mutationFn: () => {
			if (action === 'delete') {
				return request.delete(`/dealer-groups/${dealer.id}`);
			}
			return request.post(`/dealer-groups/${dealer.id}/status`, {
				status: action === 'activate' ? 'active' : 'inactive',
			});
		},
		onSuccess: () => {
			onClose();
		},
	});

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
		mutation.mutate();
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
						loading={mutation.isLoading}
					>
						{action.charAt(0).toUpperCase() + action.slice(1)}
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
}
