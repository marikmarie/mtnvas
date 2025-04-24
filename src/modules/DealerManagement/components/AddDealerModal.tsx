import { Modal, Title } from '@mantine/core';
import { AddDealerForm } from './AddDealerForm';

interface AddDealerModalProps {
	opened: boolean;
	onClose: () => void;
}

export const AddDealerModal: React.FC<AddDealerModalProps> = ({ opened, onClose }) => {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={<Title order={4}>Add New Dealer</Title>}
			centered
			size="md"
			padding="lg"
			overlayProps={{
				opacity: 0.55,
				blur: 3,
			}}
			transitionProps={{
				transition: 'pop',
				duration: 300,
				timingFunction: 'linear',
			}}
		>
			<AddDealerForm onSuccess={onClose} />
		</Modal>
	);
};
