import React from 'react';
import Layout from '../components/Layout';
import { withAuth } from '../hocs/WithAuth';
import { WakanetActivation as WakanetActivationModule } from '../modules/WakanetActivation';

const WakanetActivation: React.FC = () => {
	return (
		<Layout>
			<WakanetActivationModule />
		</Layout>
	);
};

export default React.memo(withAuth(WakanetActivation));
