import { Container, ScrollArea } from '@mantine/core';

import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useScreenWidth } from '../hooks/use-screen-width';
import { setCollapsedValue } from '../app/slices/nav';
import { Header } from './Header';

type PageProps = {
	children: React.ReactNode;
};

export default function Layout({ children }: PageProps) {
	const dispatch = useDispatch();

	const screen = useScreenWidth();

	const effect = useCallback(() => {
		if (screen === 'lg' || screen === 'xl') {
			dispatch(setCollapsedValue(false));
		}
	}, [screen, dispatch]);

	useEffect(effect, [screen]);

	return (
		<ScrollArea
			type="scroll"
			h="100vh"
			w="100vw"
			offsetScrollbars
		>
			<Header />
			<Container size={1820}>{children}</Container>
		</ScrollArea>
	);
}
