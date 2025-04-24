import React from 'react';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { lazy } from 'react';
import { Loadable } from '../hocs/Loadable';

const CheckBalanceModule = Loadable(lazy(() => import('../modules/CheckBalance')));

const CheckBalance: React.FC = () => {
	return (
		<Layout>
			<CheckBalanceModule />
		</Layout>
	);
};

export default React.memo(withAuth(CheckBalance));
