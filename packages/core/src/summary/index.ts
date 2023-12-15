export * from "./feedback";
export * from "./validate";
export * from "./schema";

import { SummaryFeedbackType } from "./feedback";
import { SummaryResponse } from "./schema";
import { ErrorType } from "./validate";

export type SummaryFormState = {
	response: SummaryResponse | null;
	feedback: SummaryFeedbackType | null;
	canProceed: boolean;
	error: ErrorType | null;
};
