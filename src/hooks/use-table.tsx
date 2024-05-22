import { MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';

export const useTable = function <T extends Record<string, any>>(
	data: T[] = [],
	columns: MRT_ColumnDef<T>[],
	loading: boolean
) {
	const table = useMantineReactTable({
		columns,
		data: data,
		enableRowSelection: false,
		enableStickyFooter: false,
		enableBottomToolbar: true,
		enableStickyHeader: true,
		enableColumnActions: false,
		enableColumnDragging: false,
		enableColumnFilterModes: false,
		enableColumnOrdering: false,
		enableEditing: false,
		enableExpandAll: false,
		enableRowActions: false,
		enableRowDragging: false,
		enableRowNumbers: false,
		enableRowOrdering: false,
		initialState: {
			pagination: { pageSize: 10, pageIndex: 0 },
			showGlobalFilter: false,
			density: 'xs',
		},
		mantinePaginationProps: {
			rowsPerPageOptions: ['10', '20', '30'],
		},
		paginationDisplayMode: 'pages',
		state: { isLoading: loading },
		mantineTableProps: {
			highlightOnHover: true,
			withColumnBorders: true,
			withBorder: true,
			sx: {
				'thead > tr': {
					backgroundColor: 'inherit',
				},
				'thead > tr > th': {
					backgroundColor: 'inherit',
				},
				'tbody > tr > td': {
					backgroundColor: 'inherit',
				},
			},
		},
	});

	return table;
};
