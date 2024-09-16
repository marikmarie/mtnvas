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
		'senderId',
	];

	const customColumnRenderers = {
		ecwCode: (data: any) => <>{data['ecwCode']}</>,
		package: (data: any) => <>{data['package']}</>,
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
