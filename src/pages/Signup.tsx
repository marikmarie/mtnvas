import React from 'react';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { lazy } from 'react';
import { Loadable } from '../hocs/Loadable';

const StarterPack = Loadable(lazy(() => import('../modules/5GStarterPack')));

const Signup: React.FC = () => {
	return (
		<Layout>
			<StarterPack />
		</Layout>
	);
};

export default React.memo(withAuth(Signup));
