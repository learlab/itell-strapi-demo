export type FocusTimeData = {
	sectionId: string;
	totalViewTime: number;
};

export const getTotalViewTime = (data: FocusTimeData[]) => {
	const totalViewTime = data.reduce((acc, cur) => {
		return acc + cur.totalViewTime;
	}, 0);

	return totalViewTime;
};
