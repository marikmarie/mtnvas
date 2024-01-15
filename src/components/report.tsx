import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import React from 'react'
import useRequest from '../hooks/use-request'

type Data = {
	subscriptionId: string
	msisdn: string
	email: string
}

export default React.memo(() => {
	const request = useRequest()

	const columns: any = React.useMemo<MRT_ColumnDef<Data>[]>(
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

	const [activations, setActivations] = React.useState<{ data: Data[] }>({ data: [] })

	const getBundleActivations = React.useCallback(async () => {
		const response = await request.get('/activations')
		setActivations(response.data as unknown as { data: Data[] })
	}, [])

	React.useEffect(() => {
		getBundleActivations()
	}, [])

	const table = useMantineReactTable({
		columns,
		data: activations.data || [],
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
