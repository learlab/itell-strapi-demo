import { SummaryResponse } from "./schema";

export const simpleFeedback = () => {
	return {
		isPassed: true,
		prompt: "You summary is accepted.",
		promptDetails: null,
		suggestedKeyphrases: null,
	};
};

export const simpleSummaryResponse = (): SummaryResponse => {
	return {
		containment: -1,
		containment_chat: null,
		similarity: -1,
		content: null,
		wording: null,
		english: true,
		included_keyphrases: [],
		suggested_keyphrases: [],
		prompt: "Your summary is accepted.",
		prompt_details: [],
		is_passed: true
	}
}