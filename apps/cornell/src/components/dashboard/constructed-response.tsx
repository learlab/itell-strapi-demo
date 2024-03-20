import { getConstructedResponse } from "@/lib/constructed-response";
import { getPageQuestions } from "@/lib/question";
import { getPageData, makePageHref } from "@/lib/utils";
import { cn, groupby } from "@itell/core/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Skeleton,
	buttonVariants,
} from "@itell/ui/server";
import { FrownIcon, LaughIcon, LightbulbIcon, MehIcon } from "lucide-react";
import Link from "next/link";
import pluralize, { plural } from "pluralize";
import { Button } from "../client-components";
import { CreateErrorFallback } from "../error-fallback";

type Props = {
	uid: string;
};

export const ConstructedResponse = async ({ uid }: Props) => {
	const data = await getConstructedResponse(uid);
	const grouped = groupby(data, (d) => d.pageSlug);
	const keys = Object.keys(grouped);
	const chapters = keys.map((k) => getPageData(k)).filter(Boolean);
	chapters.sort((a, b) => a.chapter - b.chapter);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Question Answering</CardTitle>
				<CardDescription>
					You will receive content-related questions as assessment items
					throughout the read
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{chapters.map((chapter) => {
					const answers = grouped[chapter.page_slug];
					const excellentAnswers = answers.filter((a) => a.score === 2);
					return (
						<div
							key={chapter.index}
							className="space-y-4 border border-border p-4 rounded-md"
						>
							<header>
								<p className={cn("font-semibold text-xl text-pretty")}>
									{chapter.title}
								</p>
								<p className="text-muted-foreground">
									{pluralize("answer", answers.length, true)},{" "}
									{excellentAnswers.length} excellent
								</p>
							</header>
							{answers.map((a) => (
								<div
									key={a.id}
									className="flex items-baseline justify-between gap-4"
								>
									<Link
										href={`/${a.pageSlug}#${a.chunkSlug}`}
										className="flex-1 flex items-baseline gap-2 hover:underline"
									>
										<LightbulbIcon className="size-4" />
										<p className="flex-1">{a.response}</p>
									</Link>
									{a.score === 0 ? (
										<FrownIcon />
									) : a.score === 1 ? (
										<MehIcon />
									) : (
										<LaughIcon />
									)}
								</div>
							))}
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
};

ConstructedResponse.Skeleton = () => <Skeleton className="w-full h-[200px]" />;
ConstructedResponse.ErrorFallback = CreateErrorFallback(
	"Failed to display question-answering statistics",
);
