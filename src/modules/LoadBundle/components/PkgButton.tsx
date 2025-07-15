import { Button, rem, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleCheck, IconLoader } from '@tabler/icons-react';
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
	const theme = useMantineTheme();
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
					onClose={close}
				/>
			</Modal>
			<Button
				leftIcon={
					selected ? <IconCircleCheck size={rem(18)} /> : <IconLoader size={rem(18)} />
				}
				variant={selected ? 'filled' : 'default'}
				color={selected ? theme.primaryColor : theme.colors.gray[6]}
				fullWidth
				radius="md"
				mt="md"
				onClick={() => {
					onSelect(serviceCode);
					open();
				}}
			>
				{selected ? 'Proceed to Load' : 'Select Package'}
			</Button>
		</>
	);
};
