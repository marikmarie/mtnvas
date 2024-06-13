import { Button, Container, Paper, SimpleGrid } from '@mantine/core';
import Layout from '../components/Layout';

import { WakanetActivation } from '../components/wakanet-activation';
import { withAuth } from '../hocs/with-auth';
import { memo, useState, useCallback, lazy } from 'react';
import { Loadable } from '../hocs/loadable';

const Signup = Loadable(lazy(() => import('../components/5g-stater-pack')));
const LoadBundle = Loadable(lazy(() => import('../components/load-bundle')));
const CheckBalance = Loadable(lazy(() => import('../components/check-balance')));
const UpdateDetails = Loadable(lazy(() => import('../components/update-details')));
const Report = Loadable(lazy(() => import('../components/report')));

type TAB =
	| 'signup'
	| 'load-bundle'
	| 'check-balance'
	| 'update-details'
	| 'report'
	| 'wakanet-activation';

export default memo(
	withAuth(() => {
		const [activeTab, setActiveTab] = useState<TAB>('signup');

		const onTabSwitch = useCallback((tab: TAB) => {
			setActiveTab(tab);
		}, []);

		const tabs = (
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
					onClick={() => onTabSwitch('signup')}
				>
					4G/5G Starterpack
				</Button>
				<Button
					fullWidth
					variant={activeTab === 'wakanet-activation' ? 'filled' : 'light'}
					onClick={() => onTabSwitch('wakanet-activation')}
				>
					WakaNet Router Starterpack
				</Button>
				<Button
					fullWidth
					variant={activeTab === 'load-bundle' ? 'filled' : 'light'}
					onClick={() => onTabSwitch('load-bundle')}
				>
					Load Bundle
				</Button>
				<Button
					fullWidth
					variant={activeTab === 'check-balance' ? 'filled' : 'light'}
					onClick={() => onTabSwitch('check-balance')}
				>
					Check Balance
				</Button>
				<Button
					fullWidth
					variant={activeTab === 'update-details' ? 'filled' : 'light'}
					onClick={() => onTabSwitch('update-details')}
				>
					Update Details
				</Button>
				<Button
					fullWidth
					variant={activeTab === 'report' ? 'filled' : 'light'}
					onClick={() => onTabSwitch('report')}
				>
					Activations Report
				</Button>
			</SimpleGrid>
		);
		return (
			<Layout>
				<Container size={1480}>
					<Paper
						mt="md"
						py="sm"
					>
						{tabs}
					</Paper>
					{(() => {
						switch (activeTab) {
							case 'signup':
								return <Signup />;
							case 'load-bundle':
								return <LoadBundle />;
							case 'check-balance':
								return <CheckBalance />;
							case 'update-details':
								return <UpdateDetails />;
							case 'report':
								return <Report />;
							case 'wakanet-activation':
								return <WakanetActivation />;
							default:
								return null;
						}
					})()}
				</Container>
			</Layout>
		);
	})
);
