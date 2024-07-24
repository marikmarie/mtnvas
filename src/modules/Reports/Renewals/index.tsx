import { Button, Flex, Stack, TextInput } from '@mantine/core';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import RenewalsReportTable from './RenewalsReportTable';
import { useRenewals } from '../../../hooks/use-renewals';
import useRequest from '../../../hooks/use-request';

export interface Renewal {
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

export default () => {
	const { searchQuery, setSearchQuery } = useRenewals();

	const request = useRequest(true);

	const onDownload = () => {
		request
			.get('/renewals-data', {
				responseType: 'blob',
				headers: {
					Accept: 'text/csv',
				},
			})
			.then((response: { data: BlobPart }) => {
				const blob = new Blob([response.data], { type: 'text/csv' });
				const anchorTag = document.createElement('a');
				anchorTag.href = URL.createObjectURL(blob);
				anchorTag.download = 'Renewals Report.csv';
				anchorTag.style.display = 'none';

				document.body.appendChild(anchorTag);
				anchorTag.click();

				setTimeout(() => {
					URL.revokeObjectURL(anchorTag.href);
					document.body.removeChild(anchorTag);
				}, 100);
			})
			.catch((error: any) => {
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
			<RenewalsReportTable />
			<Flex justify={'end'}>
				<Button
					leftIcon={<IconDownload />}
					onClick={onDownload}
					radius="md"
				>
					Download Renewals Report
				</Button>
			</Flex>
		</Stack>
	);
};
