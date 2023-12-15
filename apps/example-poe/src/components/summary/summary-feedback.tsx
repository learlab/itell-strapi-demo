import { ScoreType } from "@/lib/constants";
import { SummaryFeedbackType } from "@/lib/summary";
import { keyof } from "@itell/core/utils";
import { Info, Typography, Warning } from "@itell/ui/server";

type Props = {
	feedback: SummaryFeedbackType;
};

export const SummaryFeedback = ({ feedback }: Props) => {
	const FeedbackBody = (
		<div className="text-light leading-relaxed">
			{feedback.prompt}
			<details className="mt-2">
				<summary>Details</summary>
				{keyof(feedback.individualPrompt).map((key) => {
					const individualFeedback = feedback.individualPrompt[key];
					let label: string;
					if (key === ScoreType.similarity) {
						label = "Topic Similarity";
					} else if (key === ScoreType.containment) {
						label = "Topic Borrowing";
					} else {
						label = key;
					}
					return (
						individualFeedback.prompt && (
							<p key={key}>
								<span style={{ textTransform: "capitalize" }}>{`${
									individualFeedback.isPassed ? "✅" : "❌"
								} ${label}: `}</span>
								{feedback.individualPrompt[key].prompt}
							</p>
						)
					);
				})}
			</details>
		</div>
	);

	return feedback.isPassed ? (
		<Info>{FeedbackBody}</Info>
	) : (
		<Warning>{FeedbackBody}</Warning>
	);
};
