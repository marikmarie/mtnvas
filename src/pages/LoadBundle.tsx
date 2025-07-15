import React, { lazy } from 'react';
import Layout from '../components/Layout';
import { Loadable } from '../hocs/loadable';
import { withAuth } from '../hocs/WithAuth';

const LoadBundleModule = Loadable(lazy(() => import('../modules/LoadBundle')));

const LoadBundle: React.FC = () => {
	return (
		<Layout>
			<LoadBundleModule />
		</Layout>
	);
};

export default React.memo(withAuth(LoadBundle));
