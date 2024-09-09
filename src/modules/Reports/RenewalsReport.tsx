import GeneralReportTable from './GeneralReport';

export default function RenewalsReportTable() {
	const columns = [
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
	];

	const customColumnRenderers = {
		ecwCode: (data: any) => <>{data['ecwCode']}</>,
		smsNameDetail: (data: any) => <>{data['smsNameDetail']}</>,
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
