import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
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

export default memo(() => {
	const request = useRequest()
	const [loading, setLoading] = useState(false)

	const columns = useMemo<MRT_ColumnDef<Report>[]>(
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
				accessorKey: 'amount',
				header: 'AMOUNT',
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

	const [report, setReport] = useState<{ data: Report[] }>({ data: [] })

	const handleGetActivationsReport = useCallback(async () => {
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

	useEffect(() => {
		handleGetActivationsReport()
	}, [])

	const table = useTable(report.data, columns, loading)

	return (
		<Stack py="lg">
			<MantineReactTable table={table} />
		</Stack>
	)
})
