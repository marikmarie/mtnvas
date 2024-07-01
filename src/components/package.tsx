import { Card, Text, Badge, Flex } from '@mantine/core';
import { IconBrandSpeedtest } from '@tabler/icons-react';
import { Dispatch, FC, SetStateAction, memo } from 'react';
import { PkgButton } from './LoadBundle/PkgButton';

export const Package: FC<{
	amount: string;
	speed: string;
	serviceCode: string;
	selectedSrvCode: string;
	setSelectedSrvCode: Dispatch<SetStateAction<string>>;
}> = memo(({ setSelectedSrvCode, serviceCode, amount, speed, selectedSrvCode }) => {
	const badge = ['ITTH_14GB', '1778FHI4', '1778FHI1', '1778FHI2', '1778FHI3'].includes(
		serviceCode
	)
		? 'bundle'
		: ['FWA_3MBPS', 'FWA_5MBPS', 'FWA_10MBPS', 'FWA_20MBPS'].includes(serviceCode)
			? '4g speed'
			: '5g speed';

	const selected = selectedSrvCode === serviceCode;

	return (
		<Card
			w="100%"
			radius={'md'}
			withBorder
		>
			<Flex
				justify={'space-between'}
				align={'center'}
				mb="md"
				gap={'lg'}
			>
				<IconBrandSpeedtest color="orange" />
				<Text
					fz="xl"
					ta="center"
					fw={600}
				>
					{speed}
				</Text>
				<Badge variant="dot">{badge}</Badge>
			</Flex>

			<Text
				fz="xl"
				ta="center"
				fw={500}
			>
				{amount}
			</Text>

			<PkgButton
				selected={selected}
				onSelect={() => setSelectedSrvCode(serviceCode)}
				serviceCode={serviceCode}
				selectedSrvCode={selectedSrvCode}
				amount={amount}
				speed={speed}
			/>
		</Card>
	);
});
