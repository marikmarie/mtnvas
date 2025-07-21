import React, { lazy } from 'react';
import Layout from '../components/Layout';
import { Loadable } from '../hocs/loadable';
import { withAuth } from '../hocs/WithAuth';

const RenewalsReportModule = Loadable(lazy(() => import('../modules/Reports/RenewalsReport')));

const RenewalsReport: React.FC = () => {
	return (
		<Layout>
			<RenewalsReportModule />
		</Layout>
	);
};

export default React.memo(withAuth(RenewalsReport));
