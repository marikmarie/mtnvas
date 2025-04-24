import React from 'react';
import { Stack, Title, Paper } from '@mantine/core';
import { AddDealerForm } from '../modules/DealerManagement/components/AddDealerForm';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const AddDealer: React.FC = () => {
	const navigate = useNavigate();

	const handleSuccess = () => {
		navigate('/dealer-management');
	};

	return (
		<Layout>
			<Stack spacing="lg">
				<Title order={2}>Add New Dealer</Title>
				<Paper
					shadow="xs"
					p="md"
				>
					<AddDealerForm onSuccess={handleSuccess} />
				</Paper>
			</Stack>
		</Layout>
	);
};

export default AddDealer;
