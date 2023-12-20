import { SummaryResponse } from "./schema";

export enum ScoreType {
	content = "Content",
	wording = "Wording",
	similarity = "Topic Similarity",
	containment = "Topic Borrowing",
}

export const ScoreThreshold: Record<ScoreType, number> = {
	[ScoreType.content]: 0,
	[ScoreType.wording]: -1,
	[ScoreType.similarity]: 0.5,
	[ScoreType.containment]: 0.6,
};

export interface Feedback {
	isPassed: boolean;
	prompt: string | null;
}

export type IndividualPrompt = { type: ScoreType; feedback: Feedback };

export type SummaryFeedbackType = {
	isPassed: boolean;
	prompt: string;
	promptDetails: IndividualPrompt[] | null; // can be null when AI feedback is not enabled
	suggestedKeyphrases: string[] | null;
};

export const containmentFeedback = (score: number): Feedback => {
	if (score > ScoreThreshold[ScoreType.containment]) {
		return {
			isPassed: false,
			prompt:
				"You need to depend less on the language in the text and focus more on rewriting the key ideas.",
		};
	}

	return {
		isPassed: true,
		prompt:
			"You did a good job of using your own language to describe the main ideas of the text.",
	};
};

export const similarityFeedback = (score: number): Feedback => {
	if (score > ScoreThreshold[ScoreType.similarity]) {
		return {
			isPassed: true,
			prompt:
				"You did a good job of staying on topic and writing about the main ideas of the text.",
		};
	}

	return {
		isPassed: false,
		prompt:
			"To be successful, you need to better stay on topic. Find the main ideas of the text and focus your summary on those ideas",
	};
};

export const contentFeedback = (score: number | null): Feedback => {
	if (score === null) {
		return {
			isPassed: false,
			prompt: null,
		};
	}

	if (score < ScoreThreshold[ScoreType.content]) {
		return {
			isPassed: false,
			prompt:
				" You need to include more key ideas and details from the page to successfully summarize the content. Consider focusing on the main ideas of the text and providing support for those ideas in your summary.",
		};
	}

	return {
		isPassed: true,
		prompt:
			"You did a good job of including key ideas and details on this page.",
	};
};

export const wordingFeedback = (score: number | null): Feedback => {
	if (score === null) {
		return {
			isPassed: false,
			prompt: null,
		};
	}

	if (score < ScoreThreshold[ScoreType.wording]) {
		return {
			isPassed: false,
			prompt:
				" You need to paraphrase words and ideas on this page better. Focus on using different words and sentences than those used in the text. Also, try to use more objective language (or less emotional language).",
		};
	}

	return {
		isPassed: true,
		prompt:
			"You did a good job of paraphrasing words and sentences from the text and using objective language.",
	};
};

export const simpleFeedback = (): SummaryFeedbackType => {
	return {
		isPassed: true,
		prompt: "You summary is accepted.",
		promptDetails: null,
		suggestedKeyphrases: null,
	};
};

export const getFeedback = (response: SummaryResponse): SummaryFeedbackType => {
	const wording = wordingFeedback(response.wording);
	const content = contentFeedback(response.content);
	const similarity = similarityFeedback(response.similarity);
	const containment = containmentFeedback(response.containment);

	const passedNum =
		Number(wording.isPassed) +
		Number(content.isPassed) +
		Number(similarity.isPassed) +
		Number(containment.isPassed);

	const isPassed = containment.isPassed && wording.isPassed && content.isPassed;
	let prompt: string;
	if (isPassed) {
		if (passedNum > 3) {
			prompt = "Excellent job on summarizing the text.";
		} else {
			prompt = "Good job on summarizing the text.";
		}
	} else {
		prompt = "You summary could be proved. Please see the suggestions below.";
	}

	return {
		isPassed,
		prompt,
		suggestedKeyphrases: response.suggested_keyphrases,
		promptDetails: [
			{
				type: ScoreType.wording,
				feedback: wording,
			},
			{
				type: ScoreType.content,
				feedback: content,
			},
			{
				type: ScoreType.similarity,
				feedback: similarity,
			},
			{
				type: ScoreType.containment,
				feedback: containment,
			},
		],
	};
};
