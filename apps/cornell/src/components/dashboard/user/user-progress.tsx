import { Progress } from "@/components/client-components";
import { allPagesSorted } from "@/lib/pages";
import { User } from "@prisma/client";

export const UserProgress = ({ user }: { user: User }) => {
	const validPages = allPagesSorted.filter((page) => page.summary);
	const userIndex = user.pageSlug
		? validPages.findIndex((p) => p.page_slug === user.pageSlug) || 0
		: 0;
	// if user is at the first page, progress is 0
	const unlockedPages = userIndex === 0 ? 0 : userIndex + 1;
	const progress = (unlockedPages / validPages.length) * 100;
	return (
		<div className="flex items-center gap-4">
			<Progress value={progress} className="w-1/3" />
			<p className="text-muted-foreground">
				{progress.toFixed(2)}% completed, {unlockedPages}/{validPages.length}{" "}
				chapters
			</p>
		</div>
	);
};
