export enum ReadingTimeChartLevel {
	week_1 = "week_1",
	week_2 = "week_2",
	month_1 = "month_1",
	month_2 = "month_2",
	month_3 = "month_3",
}

export type ReadingTimeChartParams = {
	level: ReadingTimeChartLevel;
};
