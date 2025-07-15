import { Button, Text as MantineText } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowRight, IconCircleCheck } from '@tabler/icons-react';
import { SetStateAction } from 'react';
import { Modal } from '../../../components/Modal';
import LoadBundleForm from './LoadBundleForm';

type TPkgButtonProps = {
	selected: boolean;
	onSelect: (value: SetStateAction<string>) => void;
	serviceCode: string;
	selectedSrvCode: string;
	amount: string;
	speed?: string;
	volume?: string;
};

export const PkgButton = ({
	onSelect,
	selected,
	serviceCode,
	selectedSrvCode,
	amount,
	speed,
	volume,
}: TPkgButtonProps) => {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Button
				leftIcon={
					selected ? (
						<IconCircleCheck
							size={18}
							color="#FFD600"
						/>
					) : (
						<IconArrowRight
							size={18}
							color="#FFD600"
						/>
					)
				}
				onClick={() => {
					onSelect(serviceCode);
					open();
				}}
				variant={selected ? 'filled' : 'light'}
				color={selected ? 'yellow' : 'gray'}
				fullWidth
				radius="md"
				size="md"
				style={{
					fontWeight: 600,
					transition: 'all 0.2s ease',
				}}
			>
				<MantineText
					size="sm"
					weight={600}
				>
					{selected ? 'Selected' : 'Select Plan'}
				</MantineText>
			</Button>

			<Modal
				opened={opened}
				close={close}
			>
				<LoadBundleForm
					selectedSrvCode={selectedSrvCode || serviceCode}
					amount={amount}
					speed={speed}
					volume={volume}
				/>
			</Modal>
		</>
	);
};
