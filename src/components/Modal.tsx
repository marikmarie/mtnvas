import {
	Box,
	CloseButton,
	MantineTransition,
	ScrollArea,
	Modal as Wrapper,
	createStyles,
	useMantineTheme,
} from '@mantine/core';
import { FC, useEffect, useState } from 'react';

interface Props {
	opened: boolean;
	close: () => void;
	children: React.ReactNode;
	size?: string;
	height?: string;
	title?: string;
	withCloseButton?: boolean;
	closeOnClickOutside?: boolean;
	closeOnEscape?: boolean;
	padding?: number | string;
	radius?: number | string;
	shadow?: string;
	centered?: boolean;
	fullScreen?: boolean;
	lockScroll?: boolean;
	trapFocus?: boolean;
	withOverlay?: boolean;
	overlayOpacity?: number;
	overlayBlur?: number;
	zIndex?: number;
	transition?: MantineTransition;
	transitionDuration?: number;
}

const useStyles = createStyles(
	(
		theme,
		{
			padding,
			radius,
			shadow,
		}: {
			padding?: number | string;
			radius?: number | string;
			shadow?: string;
		}
	) => ({
		modal: {
			padding: 0,
			borderRadius: radius || theme.radius.lg,
			boxShadow:
				shadow ||
				(theme.colorScheme === 'dark'
					? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
					: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'),
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
			border:
				theme.colorScheme === 'dark'
					? `1px solid ${theme.colors.dark[5]}`
					: `1px solid ${theme.colors.gray[2]}`,
			overflow: 'hidden',
			position: 'relative',
		},

		header: {
			position: 'sticky',
			top: 0,
			zIndex: 10,
			backgroundColor:
				theme.colorScheme === 'dark' ? `${theme.colors.dark[7]}f0` : `${theme.white}f0`,
			backdropFilter: 'blur(8px)',
			borderBottom: `1px solid ${
				theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
			}`,
			padding: theme.spacing.md,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			minHeight: 60,
		},

		content: {
			padding: padding || 0,
			position: 'relative',
			maxHeight: 'calc(90vh - 60px)',
		},

		scrollArea: {
			height: '100%',
			'& .mantine-ScrollArea-scrollbar': {
				'&:hover': {
					backgroundColor:
						theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
				},
			},
			'& .mantine-ScrollArea-thumb': {
				backgroundColor:
					theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
				borderRadius: theme.radius.xl,
				'&:hover': {
					backgroundColor:
						theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
				},
			},
		},

		closeButton: {
			color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
			'&:hover': {
				backgroundColor:
					theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
				color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
			},
			transition: 'all 150ms ease',
		},

		overlay: {
			backgroundColor:
				theme.colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
			backdropFilter: 'blur(4px)',
		},

		// Animation classes
		modalEnter: {
			opacity: 0,
			transform: 'scale(0.95) translateY(-10px)',
		},

		modalEnterActive: {
			opacity: 1,
			transform: 'scale(1) translateY(0)',
			transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
		},

		modalExit: {
			opacity: 1,
			transform: 'scale(1) translateY(0)',
		},

		modalExitActive: {
			opacity: 0,
			transform: 'scale(0.95) translateY(-10px)',
			transition: 'all 150ms cubic-bezier(0.4, 0, 1, 1)',
		},
	})
);

export const Modal: FC<Props> = ({
	opened,
	close,
	size = 'md',
	height,
	children,
	title,
	withCloseButton = true,
	closeOnClickOutside = true,
	closeOnEscape = true,
	padding,
	radius,
	shadow,
	centered = true,
	fullScreen = false,
	lockScroll = true,
	trapFocus = true,
	withOverlay = true,
	overlayOpacity = 0.6,
	overlayBlur = 4,
	zIndex = 200,
	transition = 'fade',
	transitionDuration = 200,
}) => {
	const theme = useMantineTheme();
	const { classes } = useStyles({ padding, radius, shadow });
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Wrapper
			opened={opened}
			onClose={close}
			size={size}
			centered={centered}
			fullScreen={fullScreen}
			lockScroll={lockScroll}
			trapFocus={trapFocus}
			closeOnClickOutside={closeOnClickOutside}
			closeOnEscape={closeOnEscape}
			zIndex={zIndex}
			withOverlay={withOverlay}
			overlayProps={{
				className: classes.overlay,
				opacity: overlayOpacity,
				blur: overlayBlur,
			}}
			styles={{
				root: {
					padding: 0,
					borderRadius: radius || theme.radius.lg,
					boxShadow:
						shadow ||
						(theme.colorScheme === 'dark'
							? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
							: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'),
					backgroundColor:
						theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
					border:
						theme.colorScheme === 'dark'
							? `1px solid ${theme.colors.dark[5]}`
							: `1px solid ${theme.colors.gray[2]}`,
					overflow: 'hidden',
					position: 'relative',
					height: height || 'auto',
					maxHeight: fullScreen ? '100vh' : '90vh',
				},
				header: {
					display: 'none', // We'll use our custom header
				},
				body: {
					padding: 0,
				},
			}}
			transitionProps={{
				transition,
				duration: transitionDuration,
				timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
			}}
		>
			<Box className={classes.content}>
				{(title || withCloseButton) && (
					<div className={classes.header}>
						{title && (
							<Box>
								{typeof title === 'string' ? (
									<h2
										style={{
											margin: 0,
											fontSize: theme.fontSizes.lg,
											fontWeight: 600,
											color:
												theme.colorScheme === 'dark'
													? theme.colors.dark[0]
													: theme.colors.gray[8],
										}}
									>
										{title}
									</h2>
								) : (
									title
								)}
							</Box>
						)}

						{withCloseButton && (
							<CloseButton
								className={classes.closeButton}
								onClick={close}
								size="lg"
								radius="md"
								iconSize={18}
							/>
						)}
					</div>
				)}

				<ScrollArea
					className={classes.scrollArea}
					type="scroll"
					offsetScrollbars
					scrollbarSize={8}
					scrollHideDelay={1000}
					styles={{
						scrollbar: {
							'&[data-orientation="vertical"]': {
								width: 8,
							},
							'&[data-orientation="horizontal"]': {
								height: 8,
							},
						},
					}}
				>
					{children}
				</ScrollArea>
			</Box>
		</Wrapper>
	);
};
