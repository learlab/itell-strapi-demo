import { Info, Warning } from "@itell/ui/server";
import { Accordion, AccordionItem } from "../client-components";
import { SummaryFeedbackType } from "@itell/core/summary";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { getPageData, makePageHref } from "@/lib/utils";

type Props = {
	canProceed: boolean;
	pageSlug: string;
	feedback: SummaryFeedbackType;
};

export const SummaryFeedback = ({ feedback, canProceed, pageSlug }: Props) => {
	const pageData = getPageData(pageSlug);
	if (!pageData) {
		return null;
	}

	const FeedbackBody = (
		<div className="font-light leading-relaxed space-y-2">
			<header className="flex justify-between">
				<p>{feedback.prompt}</p>
				{canProceed && pageData.nextPageSlug && (
					<Link
						href={makePageHref(pageData.nextPageSlug)}
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
