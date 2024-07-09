"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/client-components";

export const ChapterSelect = ({
	chapters,
	...rest
}: { chapters: string[] } & React.ComponentProps<typeof Select>) => {
	return (
		<Select {...rest}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Chapter" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Select a chapter</SelectLabel>
					{chapters.map((c) => (
						<SelectItem key={c} value={c}>
							Chapter {Number(c)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
