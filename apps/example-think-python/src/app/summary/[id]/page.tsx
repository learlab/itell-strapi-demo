import { TextbookPageModal } from "@/components/textbook-page-modal";
import SummaryEditor from "@/components/dashboard/summary-editor";
import SummaryOperations from "@/components/dashboard/summary-operations";
import { ScoreBadge } from "@/components/score/badge";
import { SummaryBackButton } from "@/components/summary/summary-back-button";
import { getCurrentUser } from "@/lib/auth";
import { allChaptersSorted } from "@/lib/chapters";
import { DEFAULT_TIME_ZONE, ScoreType } from "@/lib/constants";
import db from "@/lib/db";
import { getUser } from "@/lib/user";
import { relativeDate } from "@itell/core/utils";
import { Badge } from "@itell/ui/server";
import { Summary, User } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

async function getSummaryForUser(summaryId: Summary["id"], userId: User["id"]) {
	return await db.summary.findFirst({
		where: {
			id: summaryId,
			userId: userId,
		},
	});
}

interface PageProps {
	params: {
		id: string;
	};
}

export default async function ({ params }: PageProps) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return redirect("/auth");
	}
	const summary = await getSummaryForUser(params.id, currentUser.id);

	if (!summary) {
		return notFound();
	}

	const chapter = allChaptersSorted.find((c) => c.chapter === summary.chapter);
	if (!chapter) {
		return notFound();
	}

	const user = (await getUser(currentUser.id)) as User;

	return (
		<div className="px-32 py-4">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center space-x-10">
					<SummaryBackButton />
					<p className="text-sm text-muted-foreground">
						{`Created at ${relativeDate(
							summary.created_at,
							user.timeZone || DEFAULT_TIME_ZONE,
						)}`}
					</p>
				</div>
				<SummaryOperations summary={summary} />
			</div>
			<div className="grid gap-12 md:grid-cols-[200px_1fr] mt-4">
				<aside className="hidden w-[200px] flex-col md:flex space-y-4">
					<div className="flex items-center justify-center">
						<Badge variant={summary.isPassed ? "default" : "destructive"}>
							{summary.isPassed ? "Passed" : "Failed"}
						</Badge>
					</div>
					<p className="tracking-tight text-sm text-muted-foreground">
						Revise your summary here. After getting a new score, you can choose
						to update the old summary. Click on the title the review this
						section's content.
					</p>
					<div className="flex flex-col gap-2">
						<ScoreBadge
							type={ScoreType.containment}
							score={summary.containmentScore}
						/>
						<ScoreBadge
							type={ScoreType.similarity}
							score={summary.similarityScore}
						/>
						<ScoreBadge type={ScoreType.wording} score={summary.wordingScore} />
						<ScoreBadge type={ScoreType.content} score={summary.contentScore} />
					</div>
				</aside>
				<div className="space-y-2 text-center">
					<TextbookPageModal chapter={chapter} />

					<p className="text-sm text-muted-foreground">
						{`Last updated at ${relativeDate(summary.updated_at)}`}
					</p>
					<div className="max-w-2xl mx-auto">
						<SummaryEditor published summary={summary} />
					</div>
				</div>
			</div>
		</div>
	);
}
