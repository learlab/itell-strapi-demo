export * from "./feedback";
export * from "./validate";
export * from "./schema";

import { SummaryFeedbackType } from "./feedback";
import { ErrorType } from "./validate";

export type SummaryFormState = {
	feedback: SummaryFeedbackType | null;
	canProceed: boolean;
	error: ErrorType | null;
};
