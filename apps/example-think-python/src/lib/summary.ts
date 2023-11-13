import { SummaryResponse } from "@/trpc/schema";
import { ScoreThreshold, ScoreType } from "./constants";

export interface Feedback {
	isPassed: boolean;
	prompt: string | null;
}
export type SummaryFeedback = {
	isPassed: boolean;
	prompt: string;
	individualPrompt: Record<ScoreType, Feedback>;
};

export const containmentFeedback = (score: number): Feedback => {
	if (score > ScoreThreshold[ScoreType.containment]) {
		return {
			isPassed: false,
			prompt:
				"You need to depend less on the language in the text and focus more on rewriting the key ideas of the section.",
		};
	} else {
		return {
			isPassed: true,
			prompt:
				"You did a good job of using your own language to describe the main ideas in the section.",
		};
	}
};

export const similarityFeedback = (score: number): Feedback => {
	if (score > ScoreThreshold[ScoreType.similarity]) {
		return {
			isPassed: true,
			prompt:
				"You did a good job of staying on topic and writing about the main ideas of the text.",
		};
	} else {
		return {
			isPassed: false,
			prompt:
				"To be successful, you need to better stay on topic. Find the main ideas of the text and focus your summary on those ideas",
		};
	}
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
				" You need to include more key ideas and details from the section to successfully summarize the content. Consider focusing on the main ideas of the section and providing support for those ideas in your summary.",
		};
	} else {
		return {
			isPassed: true,
			prompt:
				"You did a good job of including key ideas and details from the section.",
		};
	}
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
				" You need to paraphrase words and ideas in the section better. Focus on using different words and sentences than those found in the section. Also, try to use more objective language (or less emotional language).",
		};
	} else {
		return {
			isPassed: true,
			prompt:
				"You did a good job of paraphrasing words and sentences from the section and using objective language.",
		};
	}
};

export const getFeedback = (response: SummaryResponse): SummaryFeedback => {
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
			prompt =
				"Excellent job on summarizing this section. Please move forward to the next section.";
		} else {
			prompt =
				"Good job on summarizing this section. Please move forward to the next section.";
		}
	} else {
		prompt = `Before moving onto the next section, you will need to revise the summary you wrote using the feedback provided.

		Try to include the following keywords: ${response.suggested_keyphrases.join(
			", ",
		)}`;
	}

	return {
		isPassed,
		prompt,
		individualPrompt: {
			[ScoreType.wording]: wording,
			[ScoreType.content]: content,
			[ScoreType.containment]: containment,
			[ScoreType.similarity]: similarity,
		},
	};
};
