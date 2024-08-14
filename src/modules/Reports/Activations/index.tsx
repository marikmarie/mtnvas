import { Button, Flex, Stack } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import useRequest from '../../../hooks/useRequest';
import ActivationsReportTable from './ActivationsReportTable';

export default function ActivationsReport() {
	const request = useRequest(true);

	const onDownload = () => {
		request
			.get('/csv/activations', {
				responseType: 'blob',
				headers: {
					Accept: 'text/csv',
				},
			})
			.then((response) => {
				const blob = new Blob([response.data], { type: 'text/csv' });
				const anchorTag = document.createElement('a');
				anchorTag.href = URL.createObjectURL(blob);
				anchorTag.download = 'StarterPack Activation Report.csv';
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
			<ActivationsReportTable />
			<Flex justify={'end'}>
				<Button
					leftIcon={<IconDownload />}
					onClick={onDownload}
					radius="md"
				>
					Download StarterPack Activation Report
				</Button>
			</Flex>
		</Stack>
	);
}
