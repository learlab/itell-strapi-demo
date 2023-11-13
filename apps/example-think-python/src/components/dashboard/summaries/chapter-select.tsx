"use client";

import { useRouter } from "next/navigation";
import { ChapterCombobox } from "../chapter-combobox";

export const ChapterSelect = ({
	defaultChapter,
}: { defaultChapter: number | undefined }) => {
	const router = useRouter();

	const onSelectChapter = (value: number | null) => {
		if (value) {
			router.push(`/dashboard/summaries?chapter=${value}`);
		} else {
			router.push("/dashboard/summaries");
		}
	};

	return (
		<div className="flex items-center flex-col sm:flex-row gap-4 p-2">
			<ChapterCombobox
				onValueChange={onSelectChapter}
				defaultChapter={defaultChapter}
			/>
			<p className="text-sm text-muted-foreground">Filter by chapter</p>
		</div>
	);
};
