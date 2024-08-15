export function formatCurrency(num: number | string) {
	const number = typeof num === 'string' ? Number(num) : num;
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' UGX';
}
