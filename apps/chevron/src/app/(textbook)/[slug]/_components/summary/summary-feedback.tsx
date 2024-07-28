import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { SummaryFeedback as SummaryFeedbackType } from "@itell/core/summary";
import { cn } from "@itell/core/utils";
import { Info, Warning } from "@itell/ui/server";
import { Lightbulb } from "lucide-react";

type Props = {
	className?: string;
	feedback: SummaryFeedbackType | null;
	needRevision: boolean;
};

const components = {
	true: Info,
	false: Warning,
};

export const SummaryFeedback = ({
	feedback,
	needRevision,
	className,
}: Props) => {
	const terms = feedback?.suggestedKeyphrases
		? Array.from(new Set(feedback.suggestedKeyphrases))
		: [];
	const Component = components[feedback?.isPassed ? "true" : "false"];
	return (
		<div
			className={cn(
				"font-light leading-relaxed space-y-2 animate-in fade-in",
				className,
			)}
			role="alert"
		>
			<header className="space-y-2">
				<p>
					{needRevision
						? "You have completed all the assessments on this page, but you are still welcome to summarize the text."
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
					<p className="my-2">
						Improve your summary by including some of the following keywords:
					</p>
					<ul className="space-y-1">
						{terms.map((term) => (
							<li
								className="flex items-center gap-2 text-accent-foreground"
								key={term}
							>
								<Lightbulb className="size-4" aria-hidden="true" /> {term}
							</li>
						))}
					</ul>
					{feedback.promptDetails && (
						<Accordion value="first">
							<AccordionItem
								value="first"
								title="Scoring details"
								accordionTriggerClassName="text-sm my-2 underline-none"
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
		</div>
	);
};
