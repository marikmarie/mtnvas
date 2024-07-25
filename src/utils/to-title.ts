export function toTitle(input: string) {
	const str = input
		.replace(/_/g, ' ')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.toLowerCase()
		.replace(/\b\w/g, (char) => char.toUpperCase())
		.toUpperCase();
	return str;
}
