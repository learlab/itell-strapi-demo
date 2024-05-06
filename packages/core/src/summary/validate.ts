import offensiveWords from "@/assets/offensive-words.json";
import { numOfWords } from "@/utils";

export enum ErrorType {
	LANGUAGE_NOT_EN = "LANGUAGE_NOT_EN",
	WORD_COUNT = "WORD_COUNT",
	OFFENSIVE = "OFFENSIVE",
	INTERNAL = "INTERNAL",
	SIMILAR = "SIMILAR",
}

export const ErrorFeedback: Record<ErrorType, string> = {
	[ErrorType.LANGUAGE_NOT_EN]: "Please use English for your summary.",
	[ErrorType.WORD_COUNT]: "Your summary must be between 50 and 200 words.",
	[ErrorType.OFFENSIVE]:
		"Your summary includes offensive language. Please remove the offensive language and resubmit.",
	[ErrorType.INTERNAL]:
		"Internal error occurred, please try again later. Contact lear.lab.vu@gmail.com with a copy of your summary if the problem persists.",
	[ErrorType.SIMILAR]:
		"Your summary is similar to the previous submission. Please try to provide a more unique summary.",
};

export const validateSummary = (
	input: string,
	prevInput?: string,
): ErrorType | null => {
	const wordCount = numOfWords(input);

	// check word count
	if (wordCount < 50 || wordCount > 200) {
		return ErrorType.WORD_COUNT;
	}

	for (const word of input.split(" ")) {
		if (offensiveWords.includes(word.toLowerCase())) {
			return ErrorType.OFFENSIVE;
		}
	}

	if (prevInput) {
		const similarity = levenshteinDistance(input, prevInput);
		if (similarity <= 60) {
			return ErrorType.SIMILAR;
		}
	}

	return null;
};

const levenshteinDistance = (a: string, b: string) => {
	let tmp;
	if (a.length === 0) {
		return b.length;
	}
	if (b.length === 0) {
		return a.length;
	}
	if (a.length > b.length) {
		tmp = a;
		a = b;
		b = tmp;
	}

	let i: number;
	let j: number;
	let res: number = 0;
	const row = Array(a.length);
	for (i = 0; i <= a.length; i++) {
		row[i] = i;
	}

	for (i = 1; i <= b.length; i++) {
		res = i;
		for (j = 1; j <= a.length; j++) {
			tmp = row[j - 1];
			row[j - 1] = res;
			res = Math.min(tmp + (b[i - 1] !== a[j - 1]), res + 1, row[j] + 1);
		}
		row[j - 1] = res;
	}

	return res;
};
