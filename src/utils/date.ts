export const date = (date: string) => {
	return new Date(date).toDateString() + ' ' + new Date(date).toLocaleTimeString();
};
