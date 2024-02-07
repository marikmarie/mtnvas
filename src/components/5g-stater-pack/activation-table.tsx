import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import React, { useState } from 'react'
import { Button } from '@mantine/core'
import { useDispatch } from 'react-redux'
import { setSubscriptionId } from '../../app/slices/sub-id'
import useRequest from '../../hooks/use-request'
import { useTable } from '../../hooks/use-table'

type Data = {
	subscriptionId: string
	msisdn: string
	email: string
	serviceCode: string
	createdAt: string
}

export default React.memo(() => {
	const dispatch = useDispatch()
	const request = useRequest()
	const [loading, setLoading] = useState(false)

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
				accessorKey: 'email',
				header: 'EMAIL',
			},
			{
				accessorKey: 'serviceCode',
				header: 'SERVICE CODE',
			},
			{
				accessorKey: 'createdAt',
				header: 'CREATED AT',
				Cell: ({ row }) =>
					new Date(row.original.createdAt).toDateString() +
					' ' +
					new Date(row.original.createdAt).toLocaleTimeString(),
			},
			{
				accessorKey: 'action',
				header: 'ACTION',
				Cell: ({ row }) => (
					<Button onClick={() => dispatch(setSubscriptionId(row.original.subscriptionId))}>Select</Button>
				),
			},
		],
		[],
	)

	const [activations, setActivations] = React.useState<{ data: Data[] }>({ data: [] })

	const getBundleActivations = React.useCallback(async () => {
		try {
			setLoading(true)
			const response = await request.get('/bundle-activations')
			setActivations(response.data as unknown as { data: Data[] })
			setLoading(false)
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}, [])

	React.useEffect(() => {
		getBundleActivations()
	}, [])

	const table = useTable(activations.data, columns, loading)

	return <MantineReactTable table={table} />
})
