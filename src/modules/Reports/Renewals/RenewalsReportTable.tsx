import { useMemo } from 'react';
import { useDataGridTable } from '../../../hooks/use-data-grid-table';
import { toTitle } from '../../../utils/to-title';
import { useRenewals } from '../../../hooks/use-renewals';

export default function RenewalsReportTable() {
	const { loading, filtered } = useRenewals();

	const columns = useMemo(
		() =>
			[
				'requestTime',
				'extTransId',
				'msisdn',
				'bnumber',
				'serviceCode',
				'smsNameDetail',
				'amount',
				'ecwCode',
				'channel',
				'senderId',
				'duaration',
			].map((column) => {
				return {
					name: column,
					header: toTitle(column),
					defaultFlex: 1,
				};
			}),
		[]
	);

	const renewalsReportTable = useDataGridTable({
		columns: columns,
		data: filtered,
		loading,
		mih: '70vh',
	});

	console.log('RenewalsReportTable rendering', { filteredLength: filtered.length, loading });

	return renewalsReportTable;
}
