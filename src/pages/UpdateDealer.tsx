import React from 'react';
import { Stack, Title, Paper } from '@mantine/core';
import { UpdateDealerForm } from '../modules/DealerManagement/components/UpdateDealerForm';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

const UpdateDealer: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	if (!id) {
		return <div>Invalid dealer ID</div>;
	}

	return (
		<Layout>
			<Stack spacing="lg">
				<Title order={2}>Update Dealer</Title>
				<Paper
					shadow="xs"
					p="md"
				>
					<UpdateDealerForm dealerId={id} />
				</Paper>
			</Stack>
		</Layout>
	);
};

export default UpdateDealer;
