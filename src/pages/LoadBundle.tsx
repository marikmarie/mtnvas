import React from 'react';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { lazy } from 'react';
import { Loadable } from '../hocs/Loadable';

const LoadBundleModule = Loadable(lazy(() => import('../modules/LoadBundle')));

const LoadBundle: React.FC = () => {
	return (
		<Layout>
			<LoadBundleModule />
		</Layout>
	);
};

export default React.memo(withAuth(LoadBundle));
