import { useMemo } from 'react';
import { useDataGridTable } from '../../../hooks/useDataGridTable';
import { toTitle } from '../../../utils/toTitle';
import { ActionIcon, Button, Flex, Popover, Stack, TextInput } from '@mantine/core';
import { IconCalendarTime, IconSearch } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import { subDays } from 'date-fns';
import useRenewals from '../../../hooks/useRenewals';

export default function RenewalsReportTable() {
	const {
		isLoading,
		renewals,
		searchQuery,
		setSearchQuery,
		applySearch,
		resetSearchFilters,
		dateRange,
		setDateRange,
		refetch,
	} = useRenewals();

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
			].map((column) => ({
				name: column,
				header: toTitle(column),
				defaultFlex: 1,
			})),
		[]
	);

	const renewalsReportTable = useDataGridTable({
		columns: columns,
		data: renewals,
		loading: isLoading,
		mih: '60vh',
	});

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.currentTarget.value);
	};

	const handleSearchClick = () => {
		applySearch();
		refetch();
	};

	const handleDateChange = (value: [Date | null, Date | null]) => {
		setDateRange(value);
	};

	const handleResetFilters = () => {
		resetSearchFilters();
		refetch();
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
							value={dateRange}
							onChange={handleDateChange}
							defaultDate={subDays(new Date(), 1)}
						/>
					</Popover.Dropdown>
				</Popover>
				<Flex
					justify="space-between"
					gap={'md'}
					align={'center'}
				>
					<Button onClick={handleSearchClick}>Search</Button>
					<Button
						color={'red'}
						onClick={handleResetFilters}
					>
						Reset
					</Button>
				</Flex>
			</Flex>
			{renewalsReportTable}
		</Stack>
	);
}
