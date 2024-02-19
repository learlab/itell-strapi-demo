import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { getPageData, makePageHref } from "@/lib/utils";
import { SummaryFeedback as SummaryFeedbackType } from "@itell/core/summary";
import { Info, Warning } from "@itell/ui/server";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type Props = {
	feedback: SummaryFeedbackType;
};

export const SummaryFeedback = ({ feedback }: Props) => {
	const keyphrases = new Set(feedback.suggestedKeyphrases);

	const FeedbackBody = (
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

	return feedback.isPassed ? (
		<Info className="animate-in fade-in-50">{FeedbackBody}</Info>
	) : (
		<Warning className="animate-in fade-in-50">{FeedbackBody}</Warning>
	);
};
