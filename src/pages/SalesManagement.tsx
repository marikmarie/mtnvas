import Layout from '../components/Layout';
import { TransactionList } from '../modules/Sales';

export default function SalesManagement() {
	return (
		<Layout>
			<TransactionList />
		</Layout>
	);
}
