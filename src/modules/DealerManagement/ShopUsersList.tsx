import { Stack, Text, Tabs } from '@mantine/core';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { ShopUser } from './types';

// Generate fake shop users for demonstration
const generateFakeShopUsers = (
	count: number,
	userType: 'DSA' | 'Retailer' | 'ShopAgent'
): ShopUser[] => {
	return Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		msisdn: faker.phone.number('256#########'),
		shopId: faker.string.uuid(),
		shopName: faker.company.name(),
		userType,
		createdAt: faker.date.past().toISOString(),
		status: faker.helpers.arrayElement(['active', 'inactive']),
	}));
};

export function ShopUsersList() {
	const [dsaUsers] = useState<ShopUser[]>(generateFakeShopUsers(10, 'DSA'));
	const [retailerUsers] = useState<ShopUser[]>(generateFakeShopUsers(15, 'Retailer'));
	const [agentUsers] = useState<ShopUser[]>(generateFakeShopUsers(5, 'ShopAgent'));

	const columns = [
		{ name: 'name', header: 'Name', defaultFlex: 1 },
		{ name: 'email', header: 'Email', defaultFlex: 1 },
		{ name: 'msisdn', header: 'Phone', defaultFlex: 1 },
		{ name: 'shopName', header: 'Shop', defaultFlex: 1 },
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			render: ({ data }: { data: ShopUser }) => (
				<Text
					color={data.status === 'active' ? 'green' : 'red'}
					transform="capitalize"
				>
					{data.status}
				</Text>
			),
		},
	];

	const dsaTable = useDataGridTable({
		columns,
		data: dsaUsers,
		loading: false,
	});

	const retailerTable = useDataGridTable({
		columns,
		data: retailerUsers,
		loading: false,
	});

	const agentTable = useDataGridTable({
		columns,
		data: agentUsers,
		loading: false,
	});

	return (
		<Stack>
			<Tabs defaultValue="dsa">
				<Tabs.List mb="md">
					<Tabs.Tab value="dsa">DSAs</Tabs.Tab>
					<Tabs.Tab value="retailers">Retailers</Tabs.Tab>
					<Tabs.Tab value="agents">Shop Agents</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="dsa">{dsaTable}</Tabs.Panel>

				<Tabs.Panel value="retailers">{retailerTable}</Tabs.Panel>

				<Tabs.Panel value="agents">{agentTable}</Tabs.Panel>
			</Tabs>
		</Stack>
	);
}
