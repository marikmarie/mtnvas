import { useMemo } from 'react';
import { useDataGridTable } from '../../../hooks/useDataGridTable';
import { toTitle } from '../../../utils/toTitle';
import { useRenewals } from '../../../hooks/useRenewals';
import { ActionIcon, Button, Flex, Popover, Stack, TextInput } from '@mantine/core';
import { IconCalendarTime, IconSearch } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import { subDays } from 'date-fns';

export default function RenewalsReportTable() {
	const { isLoading, renewals, searchQuery, setSearchQuery, applySearch } = useRenewals();

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

	const handleSearchClick = () => {
		applySearch();
	};

	return (
		<Stack>
			<Flex
				justify={'space-between'}
				align={'center'}
				gap={'md'}
			>
				<TextInput
					w="100%"
					placeholder="Search by msisdn"
					icon={<IconSearch />}
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<Popover
					position="top"
					withArrow
					trapFocus
					shadow="md"
				>
					<Popover.Target>
						<ActionIcon>
							<IconCalendarTime />
						</ActionIcon>
					</Popover.Target>
					<Popover.Dropdown>
						<DatePicker
							type="range"
							allowSingleDateInRange
							maxDate={new Date()}
							defaultDate={subDays(new Date(), 1)}
						/>
					</Popover.Dropdown>
				</Popover>
				<Button
					leftIcon={<IconSearch />}
					onClick={handleSearchClick}
				>
					Search
				</Button>
			</Flex>
			{renewalsReportTable}
		</Stack>
	);
}
