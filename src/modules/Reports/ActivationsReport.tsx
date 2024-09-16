import GeneralReportTable from './GeneralReport';

export default function ActivationsReportTable() {
	const columns = [
		'subscriptionId',
		'msisdn',
		'bnumber',
		'email',
		'amount',
		'status',
		'serviceCode',
		'salesAgentEmail',
		'activatedAt',
		'expiry',
		'activatedBy',
	];

	const customColumnRenderers = {
		activatedAt: (data: any) => (
			<>
				{new Date(data['performedAt']).toLocaleDateString('en-UK')}{' '}
				{new Date(data['performedAt']).toLocaleTimeString('en-UK')}
			</>
		),
		activatedBy: (data: any) => <>{data['performedBy']}</>,
	};

	return (
		<GeneralReportTable
			endpoint="/activations"
			columns={columns}
			customColumnRenderers={customColumnRenderers}
			downloadEndpoint="/csv/activations"
			downloadFileName="StarterPack Activation Report.csv"
		/>
	);
}
