import { Button, Container, Paper, SimpleGrid } from '@mantine/core';
import Layout from '../components/Layout';

import { WakanetActivation } from '../modules/WakanetActivation';
import { withAuth } from '../hocs/With-Auth';
import { memo, useState, useCallback, lazy } from 'react';
import { Loadable } from '../hocs/Loadable';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const Signup = Loadable(lazy(() => import('../modules/5GStarterPack')));
const LoadBundle = Loadable(lazy(() => import('../modules/LoadBundle')));
const CheckBalance = Loadable(lazy(() => import('../modules/CheckBalance')));
const UpdateDetails = Loadable(lazy(() => import('../modules/UpdateDetails')));
const Report = Loadable(lazy(() => import('../modules/Reports')));

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

		const user = useSelector((state: RootState) => state.auth.user);
		const isOfficeUser = user?.category === 'office';

		const allTabs = (
			<SimpleGrid
				cols={isOfficeUser ? 3 : 6}
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
					radius="md"
				>
					4G/5G Starterpack
				</Button>
				{!isOfficeUser && (
					<Button
						fullWidth
						variant={activeTab === 'wakanet-activation' ? 'filled' : 'light'}
						onClick={() => onTabSwitch('wakanet-activation')}
						radius="md"
					>
						WakaNet Router Starterpack
					</Button>
				)}
				{!isOfficeUser && (
					<Button
						fullWidth
						variant={activeTab === 'load-bundle' ? 'filled' : 'light'}
						onClick={() => onTabSwitch('load-bundle')}
						radius="md"
					>
						Load Bundle
					</Button>
				)}
				<Button
					fullWidth
					variant={activeTab === 'check-balance' ? 'filled' : 'light'}
					onClick={() => onTabSwitch('check-balance')}
					radius="md"
				>
					Check Balance
				</Button>
				{!isOfficeUser && (
					<Button
						fullWidth
						variant={activeTab === 'update-details' ? 'filled' : 'light'}
						onClick={() => onTabSwitch('update-details')}
						radius="md"
					>
						Update Details
					</Button>
				)}
				<Button
					fullWidth
					variant={activeTab === 'report' ? 'filled' : 'light'}
					onClick={() => onTabSwitch('report')}
					radius="md"
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
						{allTabs}
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
