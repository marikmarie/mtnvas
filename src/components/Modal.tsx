import { ScrollArea, Modal as Wrapper, useMantineTheme } from '@mantine/core';
import { FC } from 'react';

interface Props {
	opened: boolean;
	close: () => void;
	children: React.ReactNode;
	size?: string;
	height?: string;
}

export const Modal: FC<Props> = ({ opened, close, size, height, children }) => {
	const theme = useMantineTheme();

	return (
		<Wrapper
			opened={opened}
			onClose={close}
			overlayProps={{
				color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
				opacity: 0.55,
				blur: 3,
			}}
			sx={{ height }}
			size={size}
			centered
			transitionProps={{
				transition: 'fade',
				duration: 100,
				timingFunction: 'linear',
			}}
		>
			<ScrollArea
				type="scroll"
				offsetScrollbars
			>
				{children}
			</ScrollArea>
		</Wrapper>
	);
};
