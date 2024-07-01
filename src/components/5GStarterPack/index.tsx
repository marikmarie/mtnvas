import { Paper } from '@mantine/core';
import React from 'react';
import ActivationTable from './ActivationTable';
import { Form } from './ActivationForm';

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
