import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { formatRelative } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const keyof = <T extends Object>(obj: T) =>
	Object.keys(obj) as (keyof T)[];

export const groupby = <
	TData extends Object,
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	TTransformer extends (arg: TData) => any = (arg: TData) => TData,
>(
	data: TData[],
	selector: (item: TData) => string | number,
	transformer?: TTransformer,
) =>
	data.reduce(
		(acc, cur) => ({
			...acc,
			[selector(cur)]: (acc[selector(cur)] ?? []).concat(
				transformer ? transformer(cur) : cur,
			),
		}),
		{} as Record<string, ReturnType<TTransformer>[]>,
	);

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export const isObject = (obj: any) => {
	return typeof obj === "object" && obj !== null;
};

const oneDayInMillis = 24 * 60 * 60 * 1000;
const getDifferenceInDays = (date1: Date, date2: Date): number => {
	return Math.round(
		Math.abs((date1.getTime() - date2.getTime()) / oneDayInMillis),
	);
};

export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
	const dates: Date[] = [];
	const diff = getDifferenceInDays(startDate, endDate);

	let intervalDays: number;

	if (diff <= 7) intervalDays = 1;
	else if (diff <= 14) intervalDays = 2;
	else if (diff <= 30) intervalDays = 5;
	else if (diff <= 60) intervalDays = 10;
	else if (diff <= 90) intervalDays = 15;
	else intervalDays = 30; // One month (approximate)

	const currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		dates.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + intervalDays);
	}

	// Ensure last date in the array is not greater than endDate
	// practically, this means that when intervalDays = 1, the last element is endDate,
	// and when intervalDays > 1, the last element is less than endDate
	if (dates[dates.length - 1] > endDate) {
		dates.pop();
	}

	return dates;
};

export const numOfWords = (str: string): number => {
	if (str.trim() === "") {
		return 0;
	}
	const strWithoutSpace = str.replace(/[\s\t]+/g, " ");
	return strWithoutSpace.split(" ").length;
};

export const relativeDate = (date: Date, tz = "America/Chicago") => {
	return formatRelative(utcToZonedTime(date, tz), new Date());
};

export const formatDate = (
	date: Date,
	format: string,
	tz = "America/Chicago",
) => {
	return formatInTimeZone(date, tz, format);
};
