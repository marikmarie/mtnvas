import React from 'react';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { lazy } from 'react';
import { Loadable } from '../hocs/Loadable';

const RenewalsReportModule = Loadable(lazy(() => import('../modules/Reports/RenewalsReport')));

const RenewalsReport: React.FC = () => {
	return (
		<Layout>
			<RenewalsReportModule />
		</Layout>
	);
};

export default React.memo(withAuth(RenewalsReport));
