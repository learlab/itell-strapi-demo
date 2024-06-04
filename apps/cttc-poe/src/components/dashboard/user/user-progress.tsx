import { allPagesSorted } from "@/lib/pages";
import pluralize from "pluralize";

export const UserProgress = ({
	pageSlug,
	finished,
}: { pageSlug: string | null; finished: boolean }) => {
	let displayProgress = "0";
	const validPages = allPagesSorted.filter((page) => page.summary);
	const userIndex = validPages.findIndex((page) => page.page_slug === pageSlug);
	const unlockedPages = userIndex === -1 ? 0 : userIndex + (finished ? 1 : 0);

	if (finished) {
		displayProgress = "100";
	} else if (pageSlug) {
		displayProgress = ((unlockedPages / validPages.length) * 100).toFixed(0);
	}

	return (
		<div className="flex items-center gap-4">
			<p className="text-muted-foreground">
				{displayProgress}% completed, {unlockedPages}/{validPages.length}{" "}
				{pluralize("page", unlockedPages)}
			</p>
		</div>
	);
};
