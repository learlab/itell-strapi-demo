import { Progress } from "@/components/client-components";
import { allChaptersSorted } from "@/lib/chapters";
import { User } from "@prisma/client";
import { allChapters } from "contentlayer/generated";

export const UserProgress = ({ user }: { user: User }) => {
	const isBlankUser = user.chapter === 1;
	const userIndex = allChaptersSorted.findIndex(
		(chapter) => chapter.chapter === user.chapter,
	);
	const chaptersUnlocked = isBlankUser ? 0 : userIndex + 1;
	const progress = isBlankUser
		? 0
		: ((userIndex + 1) / allChapters.length) * 100;

	return (
		<div className="flex items-center gap-4">
			<Progress value={progress} className="w-1/3" />
			<p className="text-muted-foreground">
				{progress.toFixed(2)}% completed, {chaptersUnlocked}/
				{allChapters.length} chapters
				{isBlankUser && " (you can access the first two chapters by default)"}
			</p>
		</div>
	);
};
