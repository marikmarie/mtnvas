import React from 'react';
import { Stack, Button, Flex, Title } from '@mantine/core';
import ListDealers from './ListDealers';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const DealerManagementIndex: React.FC = () => {
	const navigate = useNavigate();

	return (
		<Stack>
			<Flex
				justify="space-between"
				align="center"
			>
				<Title order={3}>Dealer Management</Title>
				<Button
					leftIcon={<IconPlus size="1rem" />}
					onClick={() => navigate(ROUTES.DEALER_MANAGEMENT.ADD)}
					variant="light"
				>
					Add New Dealer
				</Button>
			</Flex>
			<ListDealers />
		</Stack>
	);
};
