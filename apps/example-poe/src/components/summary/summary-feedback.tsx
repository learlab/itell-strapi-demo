import { ScoreType } from "@/lib/constants";
import type { SummaryFeedbackType } from "@/lib/summary";
import { keyof } from "@itell/core/utils";
import { Info, Warning } from "@itell/ui/server";
import { Accordion, AccordionItem } from "../client-components";

type Props = {
	feedback: SummaryFeedbackType;
};

export const SummaryFeedback = ({ feedback }: Props) => {
	const FeedbackBody = (
		<div className="font-light leading-relaxed space-y-2">
			<p>{feedback.prompt}</p>
			{feedback.suggestedKeyphrases && (
				<div>
					Try to include the following keywords:
					<ul className="list-disc">
						{feedback.suggestedKeyphrases.map((keyphrase) => (
							<li className="text-accent-foreground">{keyphrase}</li>
						))}
					</ul>
				</div>
			)}
			{feedback.promptDetails && (
				<Accordion value="first">
					<AccordionItem
						value="first"
						title="Scoring details"
						accordionTriggerClassName="text-sm underline-none"
					>
						{feedback.promptDetails.map((detail) => (
							<p key={detail.type} className="space-x-1">
								<span>{detail.feedback.isPassed ? "✅" : "❌"}</span>
								<span className="font-semibold">{detail.type}:</span>
								<span>{detail.feedback.prompt}</span>
							</p>
						))}
					</AccordionItem>
				</Accordion>
			)}
		</div>
	);

	return feedback.isPassed ? (
		<Info className="animate-in fade-in-50">{FeedbackBody}</Info>
	) : (
		<Warning className="animate-in fade-in-50">{FeedbackBody}</Warning>
	);
};
