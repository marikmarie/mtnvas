import ReactDataGrid from '@inovua/reactdatagrid-community';
import { useMantineTheme } from '@mantine/core';

interface Props {
	columns: {
		name: string;
		header: string;
	}[];
	data: any[];
	loading: boolean;
	mih?: string;
}

export function useDataGridTable(props: Props) {
	const { columns, data, loading, mih } = props;
	const theme = useMantineTheme();

	return (
		<ReactDataGrid
			idProperty="id"
			columns={columns}
			dataSource={data}
			showCellBorders
			showHeader
			loading={loading}
			style={{ minHeight: mih || '60vh' }}
			pagination
			filterable
			allowUnsort
			theme={theme.colorScheme === 'light' ? 'default-light' : 'dark'}
		/>
	);
}
