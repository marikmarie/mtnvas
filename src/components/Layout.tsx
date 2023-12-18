import { Container, Flex, rem, ScrollArea } from '@mantine/core'

import { Header } from './Header'
import React from 'react'

type PageProps = {
  children: React.ReactNode
}

export default React.memo( function Layout( { children }: PageProps ) {
  return (
    <>
      <Flex>
        <ScrollArea type="never" h="100vh" w="100vw">
          <Header />
          <Container size={rem( 1500 )}>
            {children}
          </Container>
        </ScrollArea>
      </Flex>
    </>
  )
} )
