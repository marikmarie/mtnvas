import { Text, Paper } from '@mantine/core'
import React from 'react'
import ActivationTable from './activation-table'
import { Form } from './Form'

export default React.memo(() => {
	return (
		<Paper p="lg" mt="xl" shadow="lg">
			<Text fz="xl" mb="sm" fw="bold" c="dimmed">
				Update Existing customer details
			</Text>
			<ActivationTable />
			<Form />
		</Paper>
	)
})
