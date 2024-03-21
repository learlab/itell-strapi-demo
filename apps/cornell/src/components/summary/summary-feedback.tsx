import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { SummaryFeedback as SummaryFeedbackType } from "@itell/core/summary";
import { Info, Warning } from "@itell/ui/server";

type Props = {
	feedback: SummaryFeedbackType;
};

const FeedbackBody = ({ feedback }: Props) => {
	const keyphrases = new Set(feedback.suggestedKeyphrases);

	return (
		<div className="font-light leading-relaxed space-y-2">
			<header className="flex justify-between">
				<p>{feedback.prompt}</p>
			</header>
			{keyphrases.size > 0 && (
				<div>
					Try to include the following keywords:
					<ul className="list-disc">
						{Array.from(keyphrases).map((keyphrase) => (
							<li className="text-accent-foreground" key={keyphrase}>
								{keyphrase}
							</li>
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
						{feedback.promptDetails.map(
							(detail) =>
								detail.feedback.prompt && (
									<p key={detail.type} className="space-x-1">
										<span>{detail.feedback.is_passed ? "✅" : "❌"}</span>
										<span className="font-semibold">{detail.type}:</span>
										<span>{detail.feedback.prompt}</span>
									</p>
								),
						)}
					</AccordionItem>
				</Accordion>
			)}
		</div>
	);
};

export const SummaryFeedback = ({ feedback }: Props) => {
	return feedback.isPassed ? (
		<Info className="animate-in fade-in-50">
			<FeedbackBody feedback={feedback} />
		</Info>
	) : (
		<Warning className="animate-in fade-in-50">
			<FeedbackBody feedback={feedback} />
		</Warning>
	);
};
