import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const parseEventStream = async (
	stream: ReadableStream,
	onData?: (chunkData: string, done: boolean, chunkIndex: number) => void,
) => {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let done = false;
	let chunkIndex = 0;

	while (!done) {
		const { value, done: doneReading } = await reader.read();
		done = doneReading;
		if (done) {
			onData?.("", done, chunkIndex);
		} else {
			const chunk = decoder.decode(value, { stream: true });
			// chunk is in the format
			// event: <event-name>\ndata: <data>

			const data = chunk
				.trim()
				.split("\n")
				.at(1)
				?.replace(/data:\s+/, "");
			if (data) {
				onData?.(data, done, chunkIndex);
			}
			chunkIndex++;
		}
	}
};

export const median = (numbers: number[]) => {
	if (numbers.length === 0) {
		return undefined;
	}

	const sorted = Array.from(numbers).sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 0) {
		const lower = sorted[middle - 1] as number;
		const upper = sorted[middle] as number;
		return (lower + upper) / 2;
	}

	return sorted[middle];
};

export const keyof = <T extends {}>(obj: T) => Object.keys(obj) as (keyof T)[];

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
	const lastDate = dates[dates.length - 1];
	if (lastDate && lastDate > endDate) {
		dates.pop();
	}

	return dates;
};

export const numOfWords = (str: string): number => {
	if (str.trim() === "") {
		return 0;
	}
	const strWithoutSpace = str.replace(/\s+/g, " ").trim();
	return strWithoutSpace.split(" ").length;
};

interface RequestOptions extends RequestInit {
	bearerToken?: string;
}

export const createFetchWithBearerToken = (
	bearerToken?: string,
): typeof fetch => {
	return async (url: RequestInfo | URL, options: RequestOptions = {}) => {
		const { bearerToken: optionsBearerToken, ...requestOptions } = options;
		const headers = new Headers(requestOptions.headers);

		const token = optionsBearerToken || bearerToken;
		if (token) {
			headers.set("API-Key", token);
		}

		return fetch(url, {
			...requestOptions,
			headers,
		});
	};
};

export const getChunkElement = (
	chunkSlug: string | null,
	attr = "data-subsection-id",
) => {
	if (!chunkSlug) {
		return null;
	}
	const el = document.querySelector(`section[${attr}='${chunkSlug}']`);
	if (el instanceof HTMLElement) {
		return el;
	}

	return null;
};

export const getChunkSlug = (el: HTMLElement) => {
	return el.dataset.subsectionId || null;
};
