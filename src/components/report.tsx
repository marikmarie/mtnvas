import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import { memo, useMemo } from 'react'
import { Stack, TextInput } from '@mantine/core'
import { useTable } from '../hooks/use-table'
import { IconSearch } from '@tabler/icons-react'
import { useActivations } from "../hooks/use-activations"

export interface Activation {
	subscriptionId: string
	msisdn: string
	email: string
	bnumber: string
	salesAgentEmail: string
	createdAt: string
	status: string
	activatedAt:string;
	activatedBy:string;
}

export default memo(() => {
	const { loading,filtered,searchQuery,setSearchQuery} = useActivations()

	const columns = useMemo<MRT_ColumnDef<Activation>[]>(
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
				accessorKey: 'activatedAt',
				header: 'PERFORMED AT',
				Cell: ({ row }) =>
					new Date(row.original.createdAt).toDateString() +
					' ' +
					new Date(row.original.createdAt).toLocaleTimeString(),
			},
			{
				accessorKey: 'activatedBy',
				header: 'PERFORMED BY',
			},
		],
		[],
	)

	const table = useTable(filtered, columns, loading)

	return (
		<Stack py="lg">
			<TextInput
				placeholder='Search by msisdn'
				icon={<IconSearch/>}
				value={searchQuery}
				onChange={(event) => setSearchQuery(event.currentTarget.value)}
				// onChange={(value) => }
			/>
			<MantineReactTable table={table} />
		</Stack>
	)
})
