import { Button, Flex, Stack } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import useRequest from '../../../hooks/use-request';
import ActivationsReportTable from './ActivationsReportTable';

export interface Activation {
	subscriptionId: string;
	msisdn: string;
	email: string;
	bnumber?: string;
	salesAgentEmail: string;
	createdAt: string;
	status: string;
	activatedAt: string;
	activatedBy: string;
}

export default function ActivationsReport() {
	// const { searchQuery, setSearchQuery } = useActivations();

	const request = useRequest(true);

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
			{/* <TextInput
				placeholder="Search by msisdn"
				icon={<IconSearch />}
				value={searchQuery}
				onChange={(event) => setSearchQuery(event.target.value)}
			/> */}
			<ActivationsReportTable />
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
}
