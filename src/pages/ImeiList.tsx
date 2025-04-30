import Layout from '../components/Layout';
import { Paper, Title } from '@mantine/core';
import { ImeiList } from '../modules/DealerManagement/ImeiList';

export default function ImeiListPage() {
	return (
		<Layout>
			<Paper
				radius="sm"
				p="lg"
			>
				<Title
					order={2}
					mb="lg"
				>
					IMEI List
				</Title>
				<ImeiList />
			</Paper>
		</Layout>
	);
}
