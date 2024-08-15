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
} from '@mantine/core';
import { IconCalendarTime, IconSearch } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import { subDays } from 'date-fns';
import useActivations from '../../../hooks/useActivations';

export default function ActivationsReportTable() {
	const [activePage, setPage] = useState(1);

	const {
		isLoading,
		activations,
		searchQuery,
		setSearchQuery,
		applySearch,
		resetSearchFilters,
		dateRange,
		setDateRange,
		refetch,
	} = useActivations({ pageSize: 15, page: activePage });

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
						render: ({ data }: { data: any }) => (
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
						render: ({ data }: { data: any }) => <>{data['performedBy']}</>,
					};
				}
				return {
					name: column,
					defaultFlex: 2,
					header: toTitle(column),
				};
			}),
		[]
	);

	const activationsReportTable = useDataGridTable({
		columns: columns,
		data: activations,
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
			<Box>
				{activationsReportTable}
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
