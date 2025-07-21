import React, { lazy } from 'react';
import Layout from '../components/Layout';
import { Loadable } from '../hocs/loadable';
import { withAuth } from '../hocs/WithAuth';

const StarterPack = Loadable(lazy(() => import('../modules/5GStarterPack')));

const Signup: React.FC = () => {
	return (
		<Layout>
			<StarterPack />
		</Layout>
	);
};

export default React.memo(withAuth(Signup));
