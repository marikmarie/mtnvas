import React from 'react';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { lazy } from 'react';
import { Loadable } from '../hocs/Loadable';

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
