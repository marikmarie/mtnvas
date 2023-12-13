export function toTitle(input: string) {
	const str = input.replace(/([A-Z])/g, ' $1')
	return (str.charAt(0).toUpperCase() + str.slice(1)).toUpperCase()
}
