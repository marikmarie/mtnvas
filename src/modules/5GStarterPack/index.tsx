import { Paper } from '@mantine/core';
import ActivationTable from './components/ActivationTable';
import { Form } from './components/ActivationForm';

export default () => {
	return (
		<Paper
			py="lg"
			mt="xl"
		>
			<ActivationTable />
			<Form />
		</Paper>
	);
};
