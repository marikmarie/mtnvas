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

type TAB = 'signup' | 'load-bundle' | 'check-balance' | 'update-details' | 'report' | 'wakanet-activation'

export default React.memo(
	withAuth(() => {
		const [activeTab, setActiveTab] = React.useState<TAB>('signup')

		const handleSwitchToTab = React.useCallback((tab: TAB) => {
			setActiveTab(tab)
		}, [])

		return (
			<Layout>
				<Container size={1480}>
					<Paper mt="md" py="sm">
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
								variant={activeTab === 'signup' ? 'filled' : 'light'}
								onClick={() => handleSwitchToTab('signup')}
							>
								4G/5G WakaNet Starterpack
							</Button>
							<Button
								fullWidth
								variant={activeTab === 'wakanet-activation' ? 'filled' : 'light'}
								onClick={() => handleSwitchToTab('wakanet-activation')}
							>
								WakaNet Router Starterpack
							</Button>
							<Button
								fullWidth
								variant={activeTab === 'load-bundle' ? 'filled' : 'light'}
								onClick={() => handleSwitchToTab('load-bundle')}
							>
								Load Bundle
							</Button>
							<Button
								fullWidth
								variant={activeTab === 'check-balance' ? 'filled' : 'light'}
								onClick={() => handleSwitchToTab('check-balance')}
							>
								Check Balance
							</Button>
							<Button
								fullWidth
								variant={activeTab === 'update-details' ? 'filled' : 'light'}
								onClick={() => handleSwitchToTab('update-details')}
							>
								Update Details
							</Button>
							<Button
								fullWidth
								variant={activeTab === 'report' ? 'filled' : 'light'}
								onClick={() => handleSwitchToTab('report')}
							>
								Activations Report
							</Button>
						</SimpleGrid>
					</Paper>
					{(() => {
						switch (activeTab) {
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
