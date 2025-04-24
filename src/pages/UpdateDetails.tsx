import React from 'react';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { lazy } from 'react';
import { Loadable } from '../hocs/Loadable';

const UpdateDetailsModule = Loadable(lazy(() => import('../modules/UpdateDetails')));

const UpdateDetails: React.FC = () => {
	return (
		<Layout>
			<UpdateDetailsModule />
		</Layout>
	);
};

export default React.memo(withAuth(UpdateDetails));
