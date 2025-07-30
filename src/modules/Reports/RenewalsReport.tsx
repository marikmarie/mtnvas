import GeneralReportTable from './GeneralReport';

export default function RenewalsReportTable() {
	const columns = [
		'extTransId',
		'msisdn',
		'bnumber',
		'serviceCode',
		'package',
		'amount',
		'upcc_desc',
		'requestTime',
		'expiry',
		'channel',
		'paymentMode',
		'senderId',
	];

	return (
		<GeneralReportTable
			endpoint="/renewals"
			columns={columns}
			downloadEndpoint="/csv/renewals"
			downloadFileName="Renewals Report.csv"
		/>
	);
}
