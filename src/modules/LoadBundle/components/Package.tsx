import { Badge, Card, Flex, Group, Stack, Text, ThemeIcon, useMantineTheme } from '@mantine/core';
import { IconDatabase, IconRocket, IconWifi } from '@tabler/icons-react';
import { FC, memo } from 'react';
import { formatCurrency } from '../../../utils/currenyFormatter';
import { PkgButton } from './PkgButton';

export const Package: FC<{
	amount: string;
	speed?: string;
	type: '4G' | '5G' | 'bundle';
	serviceCode: string;
	selectedSrvCode: string;
	volume?: string;
	setSelectedSrvCode: (code: string) => void;
}> = memo(({ setSelectedSrvCode, type, serviceCode, amount, speed, selectedSrvCode, volume }) => {
	const isVolume = !!volume;
	const badge = isVolume ? 'Volume' : 'Speed';
	const displayValue = isVolume ? volume : speed;
	const selected = selectedSrvCode === serviceCode;
	const theme = useMantineTheme();

	const getIcon = () => {
		if (isVolume)
			return (
				<IconDatabase
					size={20}
					color={theme.colors.yellow[6]}
				/>
			);
		if (type === '5G')
			return (
				<IconRocket
					size={20}
					color={theme.colors.yellow[6]}
				/>
			);
		return (
			<IconWifi
				size={20}
				color={theme.colors.yellow[6]}
			/>
		);
	};

	const getTypeColor = () => 'yellow';

	return (
		<Card
			withBorder
			shadow={selected ? 'md' : 'sm'}
			style={{
				transform: selected ? 'scale(1.02)' : 'scale(1)',
				transition: 'all 0.2s ease',
				borderColor: selected ? '#FFCC08' : '#e9ecef',
				cursor: 'pointer',
			}}
			onClick={() => setSelectedSrvCode(serviceCode)}
		>
			<Stack spacing="md">
				<Group
					position="apart"
					align="flex-start"
				>
					<ThemeIcon
						variant="light"
						color={getTypeColor()}
						size="lg"
						radius="md"
					>
						{getIcon()}
					</ThemeIcon>
					<Badge
						variant="light"
						color={getTypeColor()}
						radius="md"
						size="sm"
						style={{ fontWeight: 600 }}
					>
						{type}
					</Badge>
				</Group>

				<Group
					position="apart"
					align="center"
					spacing="xs"
				>
					<Text
						size="xs"
						color="dark.7"
						weight={700}
						style={{ fontFamily: 'monospace' }}
					>
						{serviceCode}
					</Text>
					<Badge
						color={theme.colors.yellow[6]}
						variant="filled"
						size="xs"
					>
						{isVolume ? 'Volume Bundle' : 'Speed Bundle'}
					</Badge>
				</Group>

				<Stack
					spacing="xs"
					align="center"
				>
					<Text
						size="xl"
						weight={700}
						color="dark.8"
						ta="center"
					>
						{displayValue}
					</Text>
					<Badge
						variant="dot"
						color="yellow"
						size="sm"
						radius="md"
					>
						{badge}
					</Badge>
				</Stack>

				<Flex
					direction="column"
					align="center"
					gap="xs"
				>
					<Text
						size="sm"
						color="gray.6"
						weight={500}
					>
						Monthly Price
					</Text>
					<Text
						size="lg"
						weight={700}
						color={selected ? 'yellow.7' : 'dark.7'}
						ta="center"
					>
						{formatCurrency(amount)}
					</Text>
				</Flex>

				<PkgButton
					selected={selected}
					onSelect={() => setSelectedSrvCode(serviceCode)}
					serviceCode={serviceCode}
					selectedSrvCode={selectedSrvCode}
					amount={amount}
					speed={speed || ''}
					volume={volume || ''}
				/>
			</Stack>
		</Card>
	);
});
