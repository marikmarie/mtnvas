import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@mantine/core'
import { useDispatch } from 'react-redux'
import { setServiceCode, setSubscriptionId } from '../../app/slices/bundle-activations'
import useRequest from '../../hooks/use-request'
import { useTable } from '../../hooks/use-table'
import { date } from '../../utils/date'
import { IconCheck } from '@tabler/icons-react'

type Data = {
	subscriptionId: string
	msisdn: string
	email: string
	serviceCode: string
	createdAt: string
}

export default memo(() => {
	const dispatch = useDispatch()
	const request = useRequest(true)
	const [loading, setLoading] = useState(false)

	const columns: any = useMemo<MRT_ColumnDef<Data>[]>(
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
				Cell: ({ row }) => date(row.original.createdAt),
			},
			{
				accessorKey: 'action',
				header: 'ACTION',
				Cell: ({ row }) => {
					return (
						<Button
							variant="light"
							fullWidth
							leftIcon={<IconCheck />}
							onClick={() => {
								Promise.all([
									dispatch(setSubscriptionId(row.original.subscriptionId)),
									dispatch(setServiceCode(row.original.serviceCode)),
								])
							}}
						>
							Select
						</Button>
					)
				},
			},
		],
		[],
	)

	const [activations, setActivations] = useState<{ data: Data[] }>({ data: [] })

	const getBundleActivations = useCallback(async () => {
		try {
			setLoading(true)
			const response = await request.get('/bundle-activations')
			setActivations(response.data as unknown as { data: Data[] })
			setLoading(false)
		} catch (error) {}
	}, [])

	useEffect(() => {
		getBundleActivations()
	}, [])

	const table = useTable(activations.data, columns, loading)

	return <MantineReactTable table={table} />
})
