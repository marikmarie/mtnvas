import React from 'react';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { DealerManagementIndex } from '../modules/DealerManagement';

const DealerManagement: React.FC = () => {
	return (
		<Layout>
			<DealerManagementIndex />
		</Layout>
	);
};

export default React.memo(withAuth(DealerManagement));
