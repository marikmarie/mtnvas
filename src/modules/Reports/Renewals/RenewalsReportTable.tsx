import { useMemo } from 'react';
import { useDataGridTable } from '../../../hooks/use-data-grid-table';
import { toTitle } from '../../../utils/to-title';
import { useRenewals } from '../../../hooks/use-renewals';

export default function RenewalsReportTable() {
	const { loading, filtered } = useRenewals();

	const columns = useMemo(
		() =>
			[
				'sendeR_ID',
				'id',
				'requesT_TIME',
				'msisdn',
				'bnumber',
				'subscription_channel',
				'anumber_imsi',
				'bnumber_imsi',
				'service_code',
				'amount',
				'transferval',
				'upcc_code',
				'upcc_desc',
				'ecw_code',
				'ecw_desc',
				'ecW_XML_RESP',
				'ecW_SP_TRANS_STATUS',
				'ecW_SP_XML_STR',
				'ext_trans_id',
				'reference_id',
				'processing_node',
				'exception_str',
				'voL_BEFORE',
				'voL_AFTER',
				'refunD_ID',
				'vol_before_refund',
				'vol_after_refund',
				'extrA_MSISDN',
				'discounT_VAL',
				'ecw_transaction_id',
				'serviceCode',
				'paymentOption',
			].map((column) => {
				return {
					name: column,
					header: toTitle(column),
				};
			}),
		[]
	);

	const renewalsReportTable = useDataGridTable({
		columns: columns,
		data: filtered,
		loading,
		mih: '70vh',
	});

	return renewalsReportTable;
}
