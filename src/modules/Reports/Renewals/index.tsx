import { Box, Button, Flex } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import RenewalsReportTable from './RenewalsReportTable';
import useRequest from '../../../hooks/useRequest';

export interface Renewal {
	requestTime: string;
	extTransId: number;
	msisdn: string;
	bnumber: string;
	serviceCode: string;
	smsNameDetail: string;
	amount: string;
	ecwCode: string;
	channel: string;
	senderId: string;
	duaration: string;
}

export default () => {
	const request = useRequest(true);

	const onDownload = () => {
		request
			.get('/csv/renewals', {
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
		<Box>
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
		</Box>
	);
};
