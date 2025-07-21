import React, { lazy } from 'react';
import Layout from '../components/Layout';
import { Loadable } from '../hocs/loadable';
import { withAuth } from '../hocs/WithAuth';

const CheckBalanceModule = Loadable(lazy(() => import('../modules/CheckBalance')));

const CheckBalance: React.FC = () => {
	return (
		<Layout>
			<CheckBalanceModule />
		</Layout>
	);
};

export default React.memo(withAuth(CheckBalance));
