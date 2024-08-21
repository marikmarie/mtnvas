import { useMemo, useState } from 'react';
import { useDataGridTable } from '../../../hooks/useDataGridTable';
import { toTitle } from '../../../utils/toTitle';
import {
	ActionIcon,
	Box,
	Button,
	Flex,
	Pagination,
	Popover,
	Stack,
	TextInput,
	useMantineTheme,
} from '@mantine/core';
import { IconCalendarTime, IconSearch } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import { subDays } from 'date-fns';
import useRenewals from '../../../hooks/useRenewals';

export default function RenewalsReportTable() {
	const [activePage, setPage] = useState(1);
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
	} = useRenewals({ page: activePage, pageSize: 15 });

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
				'expiry',
				'channel',
				'senderId',
			].map((column) => {
				if (column === 'ecwCode') {
					return {
						name: column,
						header: 'ECW STATUS',
						render: ({ data }: { data: any }) => <>{data['ecwCode']}</>,
					};
				}
				if (column === 'smsNameDetail') {
					return {
						name: column,
						header: 'PRODUCT NAME',
						render: ({ data }: { data: any }) => <>{data['smsNameDetail']}</>,
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

	const renewalsReportTable = useDataGridTable({
		columns: columns,
		data: renewals,
		loading: isLoading,
		mih: '60vh',
	});

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setSearchQuery(event.currentTarget.value);

	const handleSearchClick = () => {
		applySearch();
		refetch();
	};

	const handleDateChange = (value: [Date | null, Date | null]) => setDateRange(value);

	const handleResetFilters = () => {
		resetSearchFilters();
		refetch();
	};

	const theme = useMantineTheme();

	return (
		<Stack>
			<Flex
				justify={'space-between'}
				align={'center'}
				gap={'md'}
			>
				<TextInput
					w="100%"
					placeholder="Search by msisdn (2567... / 2567... / 07...) or bnumber (25639...)"
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
						<ActionIcon color={theme.primaryColor}>
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
			<Box>
				{renewalsReportTable}
				<Pagination
					total={740}
					value={activePage}
					onChange={setPage}
					mt="xs"
				/>
			</Box>
		</Stack>
	);
}
