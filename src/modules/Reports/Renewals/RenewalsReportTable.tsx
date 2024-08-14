import { useMemo } from 'react';
import { useDataGridTable } from '../../../hooks/useDataGridTable';
import { toTitle } from '../../../utils/toTitle';
import { useRenewals } from '../../../hooks/useRenewals';
import { Stack, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function RenewalsReportTable() {
	const { isLoading, renewals, searchQuery, setSearchQuery } = useRenewals();

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
		data: renewals,
		loading: isLoading,
		mih: '70vh',
	});

	console.log('RenewalsReportTable rendering', {
		filteredLength: renewals.length,
		loading: isLoading,
	});

	return (
		<Stack>
			<TextInput
				placeholder="Search by msisdn"
				icon={<IconSearch />}
				value={searchQuery}
				onChange={(event) => setSearchQuery(event.target.value)}
			/>
			{renewalsReportTable}
		</Stack>
	);
}
