import { memo, useMemo } from 'react';
import { Button, Flex, Stack, TextInput } from '@mantine/core';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import { useActivations } from '../../hooks/use-activations';
import { useDataGridTable } from '../../hooks/use-data-grid-table';
import useRequest from '../../hooks/use-request';
import { toTitle } from '../../utils/to-title';

export interface Activation {
	subscriptionId: string;
	msisdn: string;
	email: string;
	bnumber: string;
	salesAgentEmail: string;
	createdAt: string;
	status: string;
	activatedAt: string;
	activatedBy: string;
}

export default memo(() => {
	const { loading, filtered, searchQuery, setSearchQuery } = useActivations();

	const request = useRequest(true);

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

	const onDownload = () => {
		request
			.get('/activations-data', {
				responseType: 'blob',
				headers: {
					Accept: 'text/csv',
				},
			})
			.then((response) => {
				const blob = new Blob([response.data], { type: 'text/csv' });
				const anchorTag = document.createElement('a');
				anchorTag.href = URL.createObjectURL(blob);
				anchorTag.download = 'Activation Report.csv';
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

	return (
		<Stack py="lg">
			<TextInput
				placeholder="Search by msisdn"
				icon={<IconSearch />}
				value={searchQuery}
				onChange={(event) => setSearchQuery(event.currentTarget.value)}
			/>
			{activationsReportTable}
			<Flex justify={'end'}>
				<Button
					leftIcon={<IconDownload />}
					onClick={onDownload}
					radius="md"
				>
					Download Activations Report
				</Button>
			</Flex>
		</Stack>
	);
});
