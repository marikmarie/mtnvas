import { Button, Flex, Pagination, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendarTime, IconDownload, IconSearch } from '@tabler/icons-react';
import React, { useMemo } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useReportData from '../../hooks/useReportData';
import useRequest from '../../hooks/useRequest';
import { getPaginations } from '../../utils/getPaginations';
import { toTitle } from '../../utils/toTitle';

interface GeneralReportTableProps {
	endpoint: string;
	columns: string[];
	pageSize?: number;
	customColumnRenderers?: { [key: string]: (data: any) => React.ReactNode };
	downloadEndpoint: string;
	downloadFileName: string;
}

export default function GeneralReportTable({
	endpoint,
	columns,
	pageSize = 15,
	customColumnRenderers = {},
	downloadEndpoint,
	downloadFileName,
}: GeneralReportTableProps) {
	const [activePage, setPage] = React.useState(1);
	const {
		isLoading,
		reportItems,
		searchQuery,
		setSearchQuery,
		totalCount,
		applySearch,
		resetSearchFilters,
		fromDate,
		toDate,
		setFromDate,
		setToDate,
		refetch,
	} = useReportData({ page: activePage, pageSize, endpoint });

	const tableColumns = useMemo(
		() =>
			columns.map((column) => {
				if (customColumnRenderers[column]) {
					return {
						name: column,
						header: toTitle(column),
						render: ({ data }: { data: any }) => customColumnRenderers[column](data),
					};
				}
				if (column === 'upcc_desc') {
					return {
						name: column,
						header: 'Status',
						render: ({ data }: { data: any }) => data.upcc_desc,
					};
				}
				return {
					name: column,
					header: toTitle(column),
					defaultFlex: 1,
				};
			}),
		[columns, customColumnRenderers]
	);

	const request = useRequest(true);

	const onDownload = () => {
		request
			.get(downloadEndpoint, {
				responseType: 'blob',
				headers: {
					Accept: 'text/csv',
				},
			})
			.then((response) => {
				const blob = new Blob([response.data], { type: 'text/csv' });
				const anchorTag = document.createElement('a');
				anchorTag.href = URL.createObjectURL(blob);
				anchorTag.download = downloadFileName;
				anchorTag.style.display = 'none';

				document.body.appendChild(anchorTag);
				anchorTag.click();

				setTimeout(() => {
					URL.revokeObjectURL(anchorTag.href);
					document.body.removeChild(anchorTag);
				}, 100);
			})
			.catch((error) => {
				console.error('Error downloading file:', error);
			});
	};

	const reportTable = useDataGridTable({
		columns: tableColumns,
		data: reportItems,
		loading: isLoading,
		mih: '60vh',
	});

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setSearchQuery(event.currentTarget.value);

	const handleSearchClick = () => {
		applySearch();
		refetch();
	};

	const handleFromDateChange = (value: Date | null) => {
		setFromDate(value);
		// if (value) refetch();
	};

	const handleToDateChange = (value: Date | null) => {
		setToDate(value);
		// if (value) refetch();
	};

	const handleResetFilters = () => {
		resetSearchFilters();
		refetch();
	};

	return (
		<Stack>
			<SimpleGrid cols={2}>
				<TextInput
					w="100%"
					placeholder="Search by msisdn (2567... / 2567... / 07...) or bnumber (25639...)"
					icon={<IconSearch />}
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<SimpleGrid cols={3}>
					<DatePickerInput
						maxDate={new Date()}
						value={fromDate}
						onChange={handleFromDateChange}
						// @ts-ignore
						placeholder="From date"
						icon={<IconCalendarTime />}
					/>
					<DatePickerInput
						maxDate={new Date()}
						value={toDate}
						onChange={handleToDateChange}
						// @ts-ignore
						placeholder="To date"
						icon={<IconCalendarTime />}
					/>
					<Flex
						justify={'center'}
						align={'center'}
						gap="xs"
					>
						<Button
							fullWidth
							onClick={handleSearchClick}
						>
							Search
						</Button>
						<Button
							fullWidth
							color={'red'}
							onClick={handleResetFilters}
						>
							Reset
						</Button>
					</Flex>
				</SimpleGrid>
			</SimpleGrid>
			<>
				{reportTable}
				<Flex
					justify={'space-between'}
					align={'center'}
					mt="xs"
				>
					<Pagination
						total={getPaginations(totalCount)}
						value={activePage}
						onChange={setPage}
					/>
					<Button
						leftIcon={<IconDownload />}
						onClick={onDownload}
						radius="md"
					>
						Download {downloadFileName}
					</Button>
				</Flex>
			</>
		</Stack>
	);
}
