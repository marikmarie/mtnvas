import { useMemo } from 'react';
import { useDataGridTable } from '../../../hooks/use-data-grid-table';
import { toTitle } from '../../../utils/to-title';
import { useActivations } from '../../../hooks/use-activations';

export default function ActivationsReportTable() {
	const { loading, filtered } = useActivations();

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
						defaultFlex: 1,
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
						defaultFlex: 1,
						// @ts-ignore
						render: ({ data }) => {
							return <>{data['performedBy']}</>;
						},
					};
				}
				return {
					name: column,
					header: toTitle(column),
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

	return activationsReportTable;
}
