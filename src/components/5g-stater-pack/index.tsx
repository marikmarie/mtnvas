import { Paper } from '@mantine/core'
import React from 'react'
import ActivationTable from './activation-table'
import { Form } from './form'

export default React.memo(() => {
	return (
		<Paper p="lg" mt="xl" shadow="lg">
			<ActivationTable />
			<Form />
		</Paper>
	)
})
