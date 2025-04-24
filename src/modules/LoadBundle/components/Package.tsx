import {
	Card,
	Text,
	Badge,
	Flex,
	Stack,
	Group,
	ThemeIcon,
	rem,
	useMantineTheme,
} from '@mantine/core';
import { IconBrandSpeedtest, IconMoneybag } from '@tabler/icons-react';
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
	const badgeLabel =
		type === 'bundle' ? 'Volume Bundle' : type === '4G' ? '4G Speed' : '5G Speed';
	const badgeColor = type === 'bundle' ? 'violet' : type === '4G' ? 'blue' : 'green';

	const selected = selectedSrvCode === serviceCode;
	const theme = useMantineTheme();

	return (
		<Card
			w="100%"
			radius="md"
			withBorder
			shadow={selected ? 'lg' : 'sm'}
			style={{ border: selected ? `2px solid ${theme.primaryColor}` : undefined }}
		>
			<Stack spacing="sm">
				<Group position="apart">
					<Badge
						color={badgeColor}
						variant="light"
					>
						{badgeLabel}
					</Badge>
					<Badge
						color="gray"
						variant="outline"
					>
						{serviceCode}
					</Badge>
				</Group>
				<Flex
					align="center"
					gap="xs"
				>
					<ThemeIcon
						color={theme.primaryColor}
						variant="light"
						size="lg"
						radius="md"
					>
						<IconBrandSpeedtest size={rem(20)} />
					</ThemeIcon>
					<Text
						fw={600}
						size="lg"
					>
						{speed}
					</Text>
				</Flex>
				<Flex
					align="center"
					justify="center"
					gap="xs"
				>
					<ThemeIcon
						color={theme.colors.yellow[6]}
						variant="outline"
						size="lg"
						radius="md"
					>
						<IconMoneybag size={rem(20)} />
					</ThemeIcon>
					<Text
						fw={500}
						size="md"
					>
						{formatCurrency(amount)}
					</Text>
				</Flex>
			</Stack>

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
