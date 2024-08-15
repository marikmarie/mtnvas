import ReactDataGrid from '@inovua/reactdatagrid-community';
import { useMantineTheme } from '@mantine/core';

export function useDataGridTable(props: {
	columns: {
		name: string;
		header: string;
	}[];
	data: any[];
	loading: boolean;
	mih?: string;
}) {
	const { columns, data, loading, mih } = props;
	const theme = useMantineTheme();

	return (
		<ReactDataGrid
			idProperty="id"
			columns={columns}
			dataSource={data}
			showCellBorders
			showHeader
			enableColumnAutosize={true}
			loading={loading}
			style={{ minHeight: mih || '60vh' }}
			filterable
			allowUnsort
			theme={theme.colorScheme === 'light' ? 'default-light' : 'dark'}
			activateRowOnFocus
			allowGroupSplitOnReorder
			autoCheckboxColumn
			autoFocusOnEditComplete
			cellSelectionByIndex
			checkResizeDelay={0}
			checkboxOnlyRowSelect
			checkboxSelectEnableShiftKey
			clearDataSourceCacheOnChange
			clearNodeCacheOnDataSourceChange
			collapseChildrenOnAsyncNodeCollapse
			collapseChildrenRecursive
			columnFilterContextMenuConstrainTo={''}
			rowDetailsWidth={'max-viewport-width'}
			columnResizeProxyWidth={5}
			nativeScroll
			detailsGridCacheKey=""
			keyPageStep={5}
			preventRowSelectionOnClickWithMouseMove
			sortFunctions={{}}
			generateIdFromPath={false}
			columnResizeHandleWidth={5}
			showWarnings
			isExpandKeyPressed={() => false}
			shareSpaceOnResize
			columnReorderScrollByAmount={10}
			rowHeight={35}
			selectNodesRecursive
			groupNestingSize={20}
			showColumnMenuFilterOptions
			columnFilterContextMenuPosition=""
			nodesProperty=""
			livePaginationLoadMaskHideDelay={0}
			showColumnMenuLockOptions
			expandGroupTitle={false}
			nodePathSeparator="/"
			reorderProxySize={5}
			toggleRowSelectOnClick
			hideGroupByColumns
			rowReorderScrollByAmount={10}
			idPropertySeparator="-"
			isStartEditKeyPressed={() => false}
			livePaginationLoadNextDelay={0}
			toggleCellSelectOnClick
			editStartEvent="dblclick"
			enableKeyboardNavigation
			isBinaryOperator={() => false}
			growExpandHeightWithDetails
			groupPathSeparator="/"
			showColumnMenuGroupOptions
			rowExpandHeight={200}
			preventDefaultTextSelectionOnShiftMouseDown
			isCollapseKeyPressed={() => false}
			rtl={false}
			showColumnMenuSortOptions
			treeNestingSize={20}
			virtualized
			virtualizeColumnsThreshold={10}
			multiRowExpand
			columnHeaderUserSelect
			columnUserSelect
		/>
	);
}
