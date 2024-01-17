import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import React from 'react'
import useRequest from '../hooks/use-request'

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
			},
		],
		[],
	)

	const [report, setReport] = React.useState<{ data: Report[] }>({ data: [] })

	const getReport = React.useCallback(async () => {
		const response = await request.get('/activations')
		setReport(response.data as unknown as { data: Report[] })
	}, [])

	React.useEffect(() => {
		getReport()
	}, [])

	const table = useMantineReactTable({
		columns,
		data: report.data || [],
		enableRowSelection: true,
		initialState: {
			pagination: { pageSize: 5, pageIndex: 0 },
			showGlobalFilter: false,
			density: 'xs',
		},
		paginationDisplayMode: 'pages',
	})

	return <MantineReactTable table={table} />
})
