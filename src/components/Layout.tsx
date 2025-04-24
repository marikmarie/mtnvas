import { Container, ScrollArea } from '@mantine/core';
import React from 'react';
import { Header } from './Header';

type PageProps = {
	children: React.ReactNode;
};

export default function Layout({ children }: PageProps) {
	return (
		<ScrollArea
			type="scroll"
			h="100vh"
			w="100vw"
			offsetScrollbars
		>
			<Header />
			<Container
				size={1800}
				py="md"
			>
				{children}
			</Container>
		</ScrollArea>
	);
}
