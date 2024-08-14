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
			{renewalsReportTable}
		</Stack>
	);
}
