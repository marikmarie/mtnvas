import { useMemo } from 'react';
import { useDataGridTable } from '../../../hooks/useDataGridTable';
import { toTitle } from '../../../utils/toTitle';
import { useActivations } from '../../../hooks/useActivations';
import { Stack, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function ActivationsReportTable() {
	const { loading, filtered, searchQuery, setSearchQuery } = useActivations();

	const columns = useMemo(
		() =>
			[
				'subscriptionId',
				'msisdn',
				'bnumber',
				'email',
				'amount',
				'status',
				'serviceCode',
				'salesAgentEmail',
				'activatedAt',
				'activatedBy',
			].map((column) => {
				if (column === 'activatedAt') {
					return {
						name: column,
						header: 'PERFORMED AT',
						// @ts-ignore
						render: ({ data }) => (
							<>
								{new Date(data['performedAt']).toLocaleDateString('en-UK')}{' '}
								{new Date(data['performedAt']).toLocaleTimeString('en-UK')}
							</>
						),
					};
				}
				if (column === 'activatedBy') {
					return {
						name: column,
						header: 'PERFORMED BY',
						// @ts-ignore
						render: ({ data }) => {
							return <>{data['performedBy']}</>;
						},
					};
				}
				return {
					name: column,
					header: toTitle(column),
					defaultFlex: 1,
				};
			}),
		[]
	);

	const activationsReportTable = useDataGridTable({
		columns: columns,
		data: filtered,
		loading,
		mih: '70vh',
	});

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.currentTarget.value);
	};

	return (
		<Stack>
			<TextInput
				placeholder="Search by msisdn"
				icon={<IconSearch />}
				value={searchQuery}
				onChange={handleSearchChange}
			/>
			{activationsReportTable}
		</Stack>
	);
}
