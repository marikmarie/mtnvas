import React, { lazy } from 'react';
import Layout from '../components/Layout';
import { Loadable } from '../hocs/loadable';
import { withAuth } from '../hocs/WithAuth';

const UpdateDetailsModule = Loadable(lazy(() => import('../modules/UpdateDetails')));

const UpdateDetails: React.FC = () => {
	return (
		<Layout>
			<UpdateDetailsModule />
		</Layout>
	);
};

export default React.memo(withAuth(UpdateDetails));
