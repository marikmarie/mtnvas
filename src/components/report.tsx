import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import React, { useState } from 'react'
import useRequest from '../hooks/use-request'
import { Stack } from '@mantine/core'
import { useTable } from '../hooks/use-table'

interface Report {
	subscriptionId: string
	msisdn: string
	email: string
	bnumber: string
	salesAgentEmail: string
	createdAt: string
	status: string
}

export default React.memo(() => {
	const request = useRequest()
	const [loading, setLoading] = useState(false)

	const columns = React.useMemo<MRT_ColumnDef<Report>[]>(
		() => [
			{
				accessorKey: 'subscriptionId',
				header: 'SUBSCRIPTION ID',
			},
			{
				accessorKey: 'msisdn',
				header: 'MSISDN',
			},
			{
				accessorKey: 'bnumber',
				header: 'BNUMBER',
			},
			{
				accessorKey: 'email',
				header: 'EMAIL',
			},
			{
				accessorKey: 'status',
				header: 'STATUS',
			},
			{
				accessorKey: 'salesAgentEmail',
				header: 'SALES AGENT EMAIL',
			},
			{
				accessorKey: 'createdAt',
				header: 'CREATED AT',
				Cell: ({ row }) =>
					new Date(row.original.createdAt).toDateString() +
					' ' +
					new Date(row.original.createdAt).toLocaleTimeString(),
			},
		],
		[],
	)

	const [report, setReport] = React.useState<{ data: Report[] }>({ data: [] })

	const getReport = React.useCallback(async () => {
		try {
			setLoading(true)
			const response = await request.get('/activations')
			setReport(response.data as unknown as { data: Report[] })

			setLoading(false)
		} catch (error) {
		} finally {
			setLoading(false)
		}

		const response = await request.get('/activations')
		setReport(response.data as unknown as { data: Report[] })
	}, [])

	React.useEffect(() => {
		getReport()
	}, [])

	const table = useTable(report.data, columns, loading)

	return (
		<Stack py="lg">
			<MantineReactTable table={table} />
		</Stack>
	)
})
