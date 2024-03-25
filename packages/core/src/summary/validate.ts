import offensiveWords from "@/assets/offensive-words.json";
import { numOfWords } from "@/utils";

export enum ErrorType {
	LANGUAGE_NOT_EN = "LANGUAGE_NOT_EN",
	WORD_COUNT = "WORD_COUNT",
	OFFENSIVE = "OFFENSIVE",
	INTERNAL = "INTERNAL",
	DUPLICATE = "DUPLICATE",
}

export const ErrorFeedback: Record<ErrorType, string> = {
	[ErrorType.LANGUAGE_NOT_EN]: "Please use English for your summary.",
	[ErrorType.WORD_COUNT]: "Your summary must be between 50 and 200 words.",
	[ErrorType.OFFENSIVE]:
		"Your summary includes offensive language. Please remove the offensive language and resubmit.",
	[ErrorType.INTERNAL]:
		"Internal error occurred, please try again later. Contact lear.lab.vu@gmail.com if the problem persists.",
	[ErrorType.DUPLICATE]: "Please submit a different summary.",
};

export const validateSummary = (input: string): ErrorType | null => {
	const wordCount = numOfWords(input);

	// check word count
	if (wordCount < 50 || wordCount > 200) {
		return ErrorType.WORD_COUNT;
	}

	// check offensive words
	let isOffensive = false;
	for (const word of input.split(" ")) {
		if (offensiveWords.includes(word.toLowerCase())) {
			isOffensive = true;
			break;
		}
	}
	if (isOffensive) {
		return ErrorType.OFFENSIVE;
	}

	return null;
};
