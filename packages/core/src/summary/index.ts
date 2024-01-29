export * from "./feedback";
export * from "./validate";
export * from "./schema";

import { SummaryFeedback } from "./schema";
import { ErrorType } from "./validate";

export type SummaryFormState = {
	canProceed: boolean;
	error: ErrorType | null;
	feedback: SummaryFeedback | null
};
