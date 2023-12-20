import { Progress } from "@/components/client-components";
import { allPagesSorted } from "@/lib/pages";
import { getPageData } from "@/lib/utils";
import { User } from "@prisma/client";

export const UserProgress = ({ user }: { user: User }) => {
	const isBlankUser = !user.pageSlug;
	const usersIndex = getPageData(user.pageSlug).index;
	const pagesUnlocked = isBlankUser ? 0 : usersIndex;
	const progress = (pagesUnlocked / allPagesSorted.length) * 100;
	return (
		<div className="flex items-center gap-4">
			<Progress value={progress} className="w-1/3" />
			<p className="text-muted-foreground">
				{progress.toFixed(2)}% completed, {usersIndex}/{allPagesSorted.length}{" "}
				sections
			</p>
		</div>
	);
};
