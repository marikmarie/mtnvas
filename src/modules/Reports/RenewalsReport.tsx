import { Text } from '@mantine/core';
import GeneralReportTable from './GeneralReport';

export default function RenewalsReportTable() {
	const columns = [
		'extTransId',
		'msisdn',
		'bnumber',
		'serviceCode',
		'package',
		'amount',
		'ecwCode',
		'requestTime',
		'expiry',
		'channel',
		'paymentMode',
		'senderId',
	];

	const customColumnRenderers = {
		ecwCode: (data: any) => <Text ta="center">{data['ecwCode'] || '-'}</Text>,
		package: (data: any) => <Text ta="center">{data['package']}</Text>,
	};

	return (
		<GeneralReportTable
			endpoint="/renewals"
			columns={columns}
			customColumnRenderers={customColumnRenderers}
			downloadEndpoint="/csv/renewals"
			downloadFileName="Renewals Report.csv"
		/>
	);
}
