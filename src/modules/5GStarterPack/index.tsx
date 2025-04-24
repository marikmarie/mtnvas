import { Box } from '@mantine/core';
import ActivationTable from './components/ActivationTable';
import { Form } from './components/ActivationForm';

export default () => {
	return (
		<Box
			py="lg"
			mt="xl"
		>
			<ActivationTable />
			<Form />
		</Box>
	);
};
