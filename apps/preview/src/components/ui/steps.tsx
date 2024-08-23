import { Steps } from "@itell/ui/steps";

/**
 * Step-by-step instructions
 * @module Steps
 *
 * @example
 * <i-steps>
 * 	#### step 1
 * 	instructions for step 1
 *
 * 	#### step 2
 * 	instructions for step 2
 * </i-steps>
 */
export const StepsWrapper = ({ children }: { children: React.ReactNode }) => {
	return <Steps>{children}</Steps>;
};
