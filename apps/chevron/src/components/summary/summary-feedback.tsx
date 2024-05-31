import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { SummaryFeedback as SummaryFeedbackType } from "@itell/core/summary";
import { Info, Warning } from "@itell/ui/server";
import { InfoIcon } from "lucide-react";

type Props = {
	feedback: SummaryFeedbackType | null;
	canProceed: boolean;
};

const components = {
	true: Info,
	false: Warning,
};

export const SummaryFeedback = ({ feedback, canProceed }: Props) => {
	const terms = feedback?.suggestedKeyphrases || [];
	const Component = components[feedback?.isPassed ? "true" : "false"];
	return (
		<section className="font-light leading-relaxed space-y-2 animate-in fade-in-50">
			<header className="space-y-2">
				<p>
					{canProceed
						? "You have completed all the assessments onthis page, but you are still welcome to summarize the text."
						: feedback?.prompt}
				</p>
				{feedback && !feedback.isPassed && (
					<p>
						When revising your summary, please make substantial changes to the
						entire summary. If only small changes are made, you will be asked to
						make additional revisions.
					</p>
				)}
			</header>
			{feedback && terms.length > 0 && (
				<Component>
					<p>
						Improve your summary by including some of the following keywords:
					</p>
					<ul className="space-y-2">
						{terms.map((term) => (
							<li
								className="flex items-center gap-2 text-accent-foreground"
								key={term}
							>
								<InfoIcon className="size-4" /> {term}
							</li>
						))}
					</ul>
					{feedback.promptDetails && (
						<Accordion value="first">
							<AccordionItem
								value="first"
								title="Scoring details"
								accordionTriggerClassName="text-sm underline-none"
							>
								{feedback.promptDetails.map(
									(detail) =>
										// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
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
				</Component>
			)}
		</section>
	);
};
