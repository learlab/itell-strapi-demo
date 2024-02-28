import { cn } from "@itell/core/utils";
import { BookmarkIcon } from "lucide-react";

type Heading = {
	level: "one" | "two" | "three" | "four" | "other";
	text: string | undefined;
	slug: string | undefined;
};
type TocSidebarProps = {
	headings: Heading[];
};

export const PageToc = ({ headings }: TocSidebarProps) => {
	return (
		<div>
			<p className="font-medium text-sm flex items-center">
				<span>ON THIS PAGE</span>
				<BookmarkIcon className="ml-2 size-4" />
			</p>

			<ol className="max-h-[60vh] mt-2 space-y-2 font-light leading-relaxed">
				{headings
					.filter((heading) => heading.level !== "other")
					.map((heading) => (
						<li key={heading.slug}>
							<a
								data-level={heading.level}
								href={`#${heading.slug}`}
								className={cn("hover:underline inline-flex ", {
									"text-base": heading.level === "two",
									"text-sm pl-2": heading.level === "three",
									"text-xs pl-4 text-muted-foreground":
										heading.level === "four",
									"text-muted-foreground text-xs pl-6":
										heading.level === "other",
								})}
							>
								{heading.text}
							</a>
						</li>
					))}
			</ol>
		</div>
	);
};
