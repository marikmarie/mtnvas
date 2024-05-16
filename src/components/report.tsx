import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import { memo, useMemo } from 'react'
import { Button, Stack, TextInput } from '@mantine/core'
import { useTable } from '../hooks/use-table'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useActivations } from "../hooks/use-activations"
import { useDataGridTable } from '../hooks/use-data-grid-table'
import { toTitle } from '../utils/to-title'

export interface Activation {
	subscriptionId: string
	msisdn: string
	email: string
	bnumber: string
	salesAgentEmail: string
	createdAt: string
	status: string
	activatedAt: string;
	activatedBy: string;
}

export default memo( () => {
	const { loading, filtered, searchQuery, setSearchQuery } = useActivations()

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
				Cell: ( { row } ) =>
					new Date( row.original.createdAt ).toDateString() +
					' ' +
					new Date( row.original.createdAt ).toLocaleTimeString(),
			},
			{
				accessorKey: 'activatedBy',
				header: 'PERFORMED BY',
			},
		],
		[],
	)

	const c = [
		'subscriptionId',
		'msisdn',
		'bnumber',
		'email',
		'amount',
		'status',
		'salesAgentEmail',
		'activatedAt',
	].map( ( column ) => ( {
		name: column,
		header: column === "activatedAt" ? "PERFORMED AT" : "",
		defaultFlex: 1,
	} ) );

	c.push( {
		name: 'CREATE_CREDIT_NOTE',
		header: 'CREDIT NOTE',
		// @ts-ignore
		render() {
		  return (
			<Button
			  radius="md"
			  leftIcon={<IconPlus />}
			  size="xs"
			  fullWidth
			  variant="outline"
			  onClick={() => {}}
			>
			  Create
			</Button>
		  );
		},
		headerAlign: 'center',
	  } );

	const table = useTable( filtered, columns, loading )
	const t = useDataGridTable( { columns: c, data: filtered, loading, mih: '60vh' } )

	return (
		<Stack py="lg">
			<TextInput
				placeholder='Search by msisdn'
				icon={<IconSearch />}
				value={searchQuery}
				onChange={( event ) => setSearchQuery( event.currentTarget.value )}
			// onChange={(value) => }
			/>
			<MantineReactTable table={table} />
		</Stack>
	)
} )
