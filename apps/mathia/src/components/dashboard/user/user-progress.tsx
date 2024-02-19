import { Progress } from "@/components/client-components";
import { allPagesSorted } from "@/lib/pages";
import { PageData, getPageData } from "@/lib/utils";
import { User } from "@prisma/client";

export const UserProgress = ({ user }: { user: User }) => {
	const pagesUnlocked = user.pageSlug
		? getPageData(user.pageSlug)?.index || 0
		: 0;
	const progress = (pagesUnlocked / allPagesSorted.length) * 100;
	return (
		<div className="flex items-center gap-4">
			<Progress value={progress} className="w-1/3" />
			<p className="text-muted-foreground">
				{progress.toFixed(2)}% completed, {pagesUnlocked}/
				{allPagesSorted.length} sections
			</p>
		</div>
	);
};
