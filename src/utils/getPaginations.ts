export const getPaginations = (totalCount: number) =>
	totalCount % 15 === 0 ? totalCount / 15 : totalCount / 15 + 1;
