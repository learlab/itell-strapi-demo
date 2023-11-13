"use client";

import { ScoreType } from "@/lib/constants";
import {
	Feedback,
	containmentFeedback,
	contentFeedback,
	similarityFeedback,
	wordingFeedback,
} from "@/lib/summary";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@itell/ui/client";
import { Badge } from "@itell/ui/server";

type Props = {
	type: ScoreType;
	score: number | null;
};

const config: Record<
	ScoreType,
	{ description: string; feedbackFn: (score: number) => Feedback }
> = {
	[ScoreType.wording]: {
		description:
			"measures the quality of the summary's language. If your wording score is low try to check your grammar and make sure you are using original and objective language.",
		feedbackFn: wordingFeedback,
	},
	[ScoreType.content]: {
		description:
			"measures how well you summarized the main ideas in the section. If your content score is low, try to identify and discuss more of the main ideas in the section.",
		feedbackFn: contentFeedback,
	},
	[ScoreType.containment]: {
		description:
			"measures how much language you borrowed from the section. If your containment score is high, try revising your summary using your own words",
		feedbackFn: containmentFeedback,
	},
	[ScoreType.similarity]: {
		description:
			"measures how similar your summary is to the section you summarized. If your similarity score is low, try to identify and discuss more of the main ideas in the section.",
		feedbackFn: similarityFeedback,
	},
};

export const ScoreBadge = ({ type, score }: Props) => {
	if (score === null) {
		return null;
	}

	const feedbackFn = config[type].feedbackFn;
	const feedback = feedbackFn(score);
	const description = config[type].description;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					{/* had to add the outer dive for tooltip to work */}
					<div>
						<Badge variant={feedback.isPassed ? "default" : "destructive"}>
							{`${type}: ${score.toFixed(2)}`}
						</Badge>
					</div>
				</TooltipTrigger>
				<TooltipContent className="max-w-lg text-left">
					<p>{description}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
