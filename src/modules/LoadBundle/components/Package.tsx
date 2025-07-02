import { Badge, Card, Flex, Text } from '@mantine/core';
import { IconBrandSpeedtest } from '@tabler/icons-react';
import { FC, memo } from 'react';
import { formatCurrency } from '../../../utils/currenyFormatter';
import { PkgButton } from './PkgButton';

export const Package: FC<{
	amount: string;
	speed: string;
	type: '4G' | '5G' | 'bundle';
	serviceCode: string;
	selectedSrvCode: string;
	volume?: string;
	setSelectedSrvCode: (code: string) => void;
}> = memo(({ setSelectedSrvCode, type, serviceCode, amount, speed, selectedSrvCode, volume }) => {
	const isVolume = !!volume;
	const badge = isVolume ? 'volume bundle' : 'speed bundle';

	const displayValue = isVolume ? volume : speed;

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
				{type === '4G' ? (
					<IconBrandSpeedtest color="orange" />
				) : (
					<IconBrandSpeedtest color="orange" />
				)}
				<Text
					ta="center"
					fw={600}
				>
					{displayValue}
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
