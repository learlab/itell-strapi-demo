import { cn } from "@itell/core/utils";
import { BookmarkIcon } from "lucide-react";
import { NoteCount } from "./note/note-count";

type Heading = {
	level: "one" | "two" | "three" | "other";
	text: string | undefined;
	slug: string | undefined;
};
type TocSidebarProps = {
	headings: Heading[];
};

export function TocSidebar({ headings }: TocSidebarProps) {
	return (
		<div>
			<p className="font-medium text-sm flex items-center">
				<BookmarkIcon className="mr-2 w-4 h-4" />
				<span>ON THIS PAGE</span>
			</p>
			<ul className="mt-2 space-y-1">
				{headings
					.filter((heading) => heading.level !== "other")
					.map((heading) => (
						<li
							key={heading.slug}
							className="font-light tracking-tighter line-clamp-2"
						>
							<a
								data-level={heading.level}
								href={`#${heading.slug}`}
								className={cn("hover:underline inline-flex ", {
									"text-base": heading.level === "one",
									"text-sm": heading.level === "two",
									"text-muted-foreground text-xs pl-2":
										heading.level === "three",
								})}
							>
								{heading.text}
							</a>
						</li>
					))}
			</ul>
			<div className="mt-8">
				<NoteCount />
			</div>
		</div>
	);
}
