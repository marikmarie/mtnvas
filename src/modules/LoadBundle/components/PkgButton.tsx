import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleCheck } from '@tabler/icons-react';
import { SetStateAction } from 'react';
import { Modal } from '../../../components/Modal';
import LoadBundleForm from './LoadBundleForm';

type TPkgButtonProps = {
	selected: boolean;
	onSelect: (value: SetStateAction<string>) => void;
	serviceCode: string;
	selectedSrvCode: string;
	amount: string;
	speed: string;
};

export const PkgButton = ({
	onSelect,
	selected,
	serviceCode,
	selectedSrvCode,
	amount,
	speed,
}: TPkgButtonProps) => {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<Modal
				opened={opened}
				close={close}
			>
				<LoadBundleForm
					selectedSrvCode={selectedSrvCode}
					amount={amount}
					speed={speed}
				/>
			</Modal>
			<Button
				leftIcon={selected ? <IconCircleCheck /> : null}
				onClick={() => {
					onSelect(serviceCode);
					open();
				}}
				variant={selected ? 'filled' : 'outline'}
				fullWidth
				radius="md"
				mt="lg"
			>
				{selected ? 'Package Selected' : 'Select Package'}
			</Button>
		</>
	);
};
