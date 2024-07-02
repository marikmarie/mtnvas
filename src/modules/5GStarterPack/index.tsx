import { Paper } from '@mantine/core';
import React from 'react';
import ActivationTable from './components/ActivationTable';
import { Form } from './components/ActivationForm';

export default React.memo(() => {
	return (
		<Paper
			py="lg"
			mt="xl"
		>
			<ActivationTable />
			<Form />
		</Paper>
	);
});
