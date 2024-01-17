import { Button, Container, Paper, SimpleGrid } from '@mantine/core'
import React from 'react'
import Layout from '../components/Layout'
import Signup from '../components/5g-stater-pack'
import LoadBundle from '../components/load-bundle'
import CheckBalance from '../components/check-balance'
import UpdateDetails from '../components/update-details'
import Report from '../components/report'
import { WakanetActivation } from '../components/wakanet-activation'
import { withAuth } from '../hocs/with-auth'

type BTN_TYPE = 'signup' | 'load-bundle' | 'check-balance' | 'update-details' | 'report' | 'wakanet-activation'

export default React.memo(
	withAuth(() => {
		const [activeBtn, setActiveBtn] = React.useState<BTN_TYPE>('signup')

		return (
			<Layout>
				<Container size={'xl'}>
					<Paper withBorder mt="md" p="sm">
						<SimpleGrid
							cols={6}
							breakpoints={[
								{ maxWidth: 'md', cols: 2 },
								{ maxWidth: 'xs', cols: 2 },
								{ maxWidth: 'sm', cols: 2 },
							]}
						>
							<Button
								fullWidth
								variant={activeBtn === 'signup' ? 'filled' : 'light'}
								onClick={() => setActiveBtn('signup')}
							>
								5G StarterPack
							</Button>
							<Button
								fullWidth
								variant={activeBtn === 'wakanet-activation' ? 'filled' : 'light'}
								onClick={() => setActiveBtn('wakanet-activation')}
							>
								WakaNet StarterPack
							</Button>
							<Button
								fullWidth
								variant={activeBtn === 'load-bundle' ? 'filled' : 'light'}
								onClick={() => setActiveBtn('load-bundle')}
							>
								Load Bundle
							</Button>
							<Button
								fullWidth
								variant={activeBtn === 'check-balance' ? 'filled' : 'light'}
								onClick={() => setActiveBtn('check-balance')}
							>
								Check Balance
							</Button>
							<Button
								fullWidth
								variant={activeBtn === 'update-details' ? 'filled' : 'light'}
								onClick={() => setActiveBtn('update-details')}
							>
								Update Details
							</Button>
							<Button
								fullWidth
								variant={activeBtn === 'report' ? 'filled' : 'light'}
								onClick={() => setActiveBtn('report')}
							>
								Activations Report
							</Button>
						</SimpleGrid>
					</Paper>
					{(() => {
						switch (activeBtn) {
							case 'signup':
								return <Signup />
							case 'load-bundle':
								return <LoadBundle />
							case 'check-balance':
								return <CheckBalance />
							case 'update-details':
								return <UpdateDetails />
							case 'report':
								return <Report />
							case 'wakanet-activation':
								return <WakanetActivation />
							default:
								return null
						}
					})()}
				</Container>
			</Layout>
		)
	}),
)
