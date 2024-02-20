import { Container, Flex, rem, ScrollArea } from '@mantine/core'

import { Header } from './header'
import React, { useCallback, useEffect } from 'react'
import { useScreenWidth } from '../hooks/use-screen-width'
import { useDispatch } from 'react-redux'
import { setCollapsedValue } from '../app/slices/nav'

type PageProps = {
	children: React.ReactNode
}

export default function Layout({ children }: PageProps) {
	const dispatch = useDispatch()

	const screen = useScreenWidth()

	const effect = useCallback(() => {
		if (screen === 'lg' || screen === 'xl') {
			dispatch(setCollapsedValue(false))
		} else {
			dispatch(setCollapsedValue(true))
		}
	}, [])

	useEffect(effect, [screen])

	return (
		<>
			<Flex>
				<Flex justify={'center'} align={'center'}>
					{/* {collapsed ? (
						<ActionIcon onClick={() => dispatch(toggleNav())}>
							<IconChevronCompactRight />
						</ActionIcon>
					) : (
						<ActionIcon onClick={() => dispatch(toggleNav())}>
							<IconChevronCompactLeft />
						</ActionIcon>
					)} */}
				</Flex>
				<ScrollArea type="never" h="100vh" w="100vw">
					<Header />
					<Container size={rem(1500)}>{children}</Container>
				</ScrollArea>
			</Flex>
		</>
	)
}
