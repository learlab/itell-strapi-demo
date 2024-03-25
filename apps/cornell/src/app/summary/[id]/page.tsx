import { SummaryOperations } from "@/components/dashboard/summary-operations";
import { ReviseSummaryButton } from "@/components/summary/revise-summary-button";
import { SummaryBackButton } from "@/components/summary/summary-back-button";
import { TextbookPageModal } from "@/components/textbook-page-modal";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { allPagesSorted } from "@/lib/pages";
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
	const user = await getCurrentUser();
	if (!user) {
		return redirect("/auth");
	}
	const summary = await getSummaryForUser(params.id, user.id);

	if (!summary) {
		return notFound();
	}

	const page = allPagesSorted.find(
		(page) => page.page_slug === summary.pageSlug,
	);
	if (!page) {
		return notFound();
	}

	return (
		<div className="px-32 py-4">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center space-x-10">
					<SummaryBackButton />
				</div>
				<SummaryOperations summary={summary} pageUrl={page.url} />
			</div>
			<div className="grid gap-12 md:grid-cols-[200px_1fr] mt-4">
				<aside className="w-[200px] space-y-4">
					<div className="flex items-center justify-center">
						<Badge variant={summary.isPassed ? "default" : "destructive"}>
							{summary.isPassed ? "Passed" : "Failed"}
						</Badge>
					</div>
					<p className="tracking-tight text-sm text-muted-foreground">
						Click on the title to review this page's content.
					</p>
				</aside>
				<div className="space-y-2">
					<div className="text-center">
						<TextbookPageModal page={page} />
					</div>

					<p className="text-sm text-muted-foreground text-center">
						{`Created at ${relativeDate(summary.created_at)}`}
					</p>
					<div className="max-w-2xl mx-auto">
						<p>{summary.text}</p>
						<div className="flex justify-end">
							<ReviseSummaryButton
								pageSlug={summary.pageSlug}
								text={summary.text}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
