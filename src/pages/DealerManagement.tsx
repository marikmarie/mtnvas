import { Paper, Tabs, Title } from '@mantine/core';
import { IconBox, IconBuildingStore, IconUserCircle, IconUsers } from '@tabler/icons-react';
import Layout from '../components/Layout';
import { DealerList } from '../modules/DealerManagement/DealerList';
import { ShopList } from '../modules/DealerManagement/ShopList';
import { ShopUsersList } from '../modules/DealerManagement/ShopUsersList';
import { StockList } from '../modules/DealerManagement/StockList';

export default function DealerManagement() {
	return (
		<Layout>
			<Paper radius="sm">
				<Title
					order={2}
					mb="lg"
				>
					Dealer Management
				</Title>
				<Tabs defaultValue="dealers">
					<Tabs.List mb="md">
						<Tabs.Tab
							value="dealers"
							icon={<IconUsers size={14} />}
						>
							Dealers
						</Tabs.Tab>
						<Tabs.Tab
							value="shops"
							icon={<IconBuildingStore size={14} />}
						>
							Shops
						</Tabs.Tab>
						<Tabs.Tab
							value="users"
							icon={<IconUserCircle size={14} />}
						>
							Shop Users
						</Tabs.Tab>
						<Tabs.Tab
							value="stock"
							icon={<IconBox size={14} />}
						>
							Stock Management
						</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="dealers">
						<DealerList />
					</Tabs.Panel>
					<Tabs.Panel value="shops">
						<ShopList />
					</Tabs.Panel>
					<Tabs.Panel value="users">
						<ShopUsersList shop={undefined} />
					</Tabs.Panel>
					<Tabs.Panel value="stock">
						<StockList />
					</Tabs.Panel>
				</Tabs>
			</Paper>
		</Layout>
	);
}
