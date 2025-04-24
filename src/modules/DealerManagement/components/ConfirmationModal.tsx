import { Modal, Text, Button, Group } from '@mantine/core';

interface ConfirmationModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	opened,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	loading = false,
}) => {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={title}
			centered
		>
			<Text mb="lg">{message}</Text>
			<Group position="right">
				<Button
					variant="subtle"
					onClick={onClose}
					disabled={loading}
				>
					{cancelLabel}
				</Button>
				<Button
					color="red"
					onClick={onConfirm}
					loading={loading}
				>
					{confirmLabel}
				</Button>
			</Group>
		</Modal>
	);
};
