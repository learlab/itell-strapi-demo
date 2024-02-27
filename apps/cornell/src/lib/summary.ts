import { SummaryFeedback, SummaryResponse } from "@itell/core/summary";

export const getFeedback = (response: SummaryResponse): SummaryFeedback => {
	return {
		isPassed: response.is_passed,
		prompt: response.prompt,
		promptDetails: response.prompt_details,
		suggestedKeyphrases: response.suggested_keyphrases,
	};
};
