import React, { lazy } from 'react';
import Layout from '../components/Layout';
import { Loadable } from '../hocs/loadable';
import { withAuth } from '../hocs/WithAuth';

const ActivationsReportModule = Loadable(
	lazy(() => import('../modules/Reports/ActivationsReport'))
);

const ActivationsReport: React.FC = () => {
	return (
		<Layout>
			<ActivationsReportModule />
		</Layout>
	);
};

export default React.memo(withAuth(ActivationsReport));
