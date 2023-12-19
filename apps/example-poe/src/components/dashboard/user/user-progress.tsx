import { Progress } from "@/components/client-components";
import { allSectionsSorted } from "@/lib/sections";
import { User } from "@prisma/client";

export const UserProgress = ({ user }: { user: User }) => {
	const isBlankUser = !user.pageSlug;
	const usersIndex = allSectionsSorted.findIndex(
		(section) => section.slug === user.pageSlug,
	);
	const sectionsUnlocked = isBlankUser ? 0 : usersIndex + 1;
	const progress = (sectionsUnlocked / allSectionsSorted.length) * 100;
	return (
		<div className="flex items-center gap-4">
			<Progress value={progress} className="w-1/3" />
			<p className="text-muted-foreground">
				{progress.toFixed(2)}% completed, {usersIndex + 1}/
				{allSectionsSorted.length} sections
			</p>
		</div>
	);
};
