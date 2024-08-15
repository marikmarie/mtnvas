import { Card, Text, Badge, Flex } from '@mantine/core';
import { IconBrandSpeedtest } from '@tabler/icons-react';
import { FC, memo } from 'react';
import { PkgButton } from './PkgButton';
import { formatCurrency } from '../../../utils/currenyFormatter';

export const Package: FC<{
	amount: string;
	speed: string;
	type: '4G' | '5G' | 'bundle';
	serviceCode: string;
	selectedSrvCode: string;
	setSelectedSrvCode: (code: string) => void;
}> = memo(({ setSelectedSrvCode, type, serviceCode, amount, speed, selectedSrvCode }) => {
	const badge = type === 'bundle' ? 'bundle' : type === '4G' ? '4g speed' : '5g speed';

	const selected = selectedSrvCode === serviceCode;

	return (
		<Card
			w="100%"
			radius="md"
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
					ta="center"
					fw={600}
				>
					{speed}
				</Text>
				<Badge variant="dot">{badge}</Badge>
			</Flex>

			<Text
				ta="center"
				fw={500}
			>
				{formatCurrency(amount)}
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
