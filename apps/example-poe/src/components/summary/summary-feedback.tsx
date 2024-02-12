import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { getPageData, makePageHref } from "@/lib/utils";
import { SummaryFeedback as SummaryFeedbackType } from "@itell/core/summary";
import { Info, Warning } from "@itell/ui/server";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type Props = {
	canProceed: boolean;
	nextPageSlug: string | null;
	feedback: SummaryFeedbackType;
};

export const SummaryFeedback = ({
	feedback,
	canProceed,
	nextPageSlug,
}: Props) => {
	const FeedbackBody = (
		<div className="font-light leading-relaxed space-y-2">
			<header className="flex justify-between">
				<p>{feedback.prompt}</p>
				{canProceed && nextPageSlug && (
					<Link
						href={makePageHref(nextPageSlug)}
						className="inline-flex gap-1 items-center hover:underline"
					>
						<ChevronRightIcon className="size-4" /> Move on
					</Link>
				)}
			</header>
			{feedback.suggestedKeyphrases && (
				<div>
					Try to include the following keywords:
					<ul className="list-disc">
						{feedback.suggestedKeyphrases.map((keyphrase) => (
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
