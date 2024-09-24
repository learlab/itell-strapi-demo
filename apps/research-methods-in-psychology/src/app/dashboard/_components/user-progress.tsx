import { getPageData } from "@/lib/pages/pages.client";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import Link from "next/link";
import pluralize from "pluralize";

export const UserProgress = ({
	pageSlug,
	finished,
}: { pageSlug: string | null; finished: boolean }) => {
	const pageData = getPageData(pageSlug);
	let displayProgress = "0";
	const validPages = allPagesSorted.filter((page) => page.summary);
	const userIndex = validPages.findIndex((page) => page.slug === pageSlug);
	const unlockedPages = userIndex === -1 ? 0 : userIndex + (finished ? 1 : 0);

	if (finished) {
		displayProgress = "100";
	} else if (pageSlug) {
		displayProgress = ((unlockedPages / validPages.length) * 100).toFixed(0);
	}

	return (
		<div className="leading-none">
			<p className="sr-only">reading progress</p>
			<p className="lg:text-lg font-semibold ">
				{displayProgress}% completed, {unlockedPages}/{validPages.length}{" "}
				{pluralize("page", validPages.length)}
			</p>
			<p className="text-muted-foreground">
				{finished ? (
					"finished all contents"
				) : pageSlug ? (
					<span>
						currently at{" "}
						<Link href={makePageHref(pageSlug)} className="underline italic">
							{pageData?.title}
						</Link>
					</span>
				) : (
					"not started"
				)}
			</p>
		</div>
	);
};
