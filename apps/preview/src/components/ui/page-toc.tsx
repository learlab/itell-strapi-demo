import { extractHeadingsFromMdast } from "@itell/content";
import { cn } from "@itell/utils";
import Link from "next/link";

type TocSidebarProps = {
	headings: ReturnType<typeof extractHeadingsFromMdast>;
};

export const PageToc = ({ headings }: TocSidebarProps) => {
	return (
		<div className="page-toc space-y-4 px-1">
			<div className="flex items-center gap-2">
				<div className="rounded-full ring-2 ring-blue-400 size-3" />
				<h3 className="font-semibold">On this page</h3>
			</div>
			<ol className="flex flex-col list-none text-foreground/70 tracking-tight">
				{headings
					.filter((heading) => heading.depth <= 4)
					.map((heading) => (
						<li
							key={heading.slug}
							className={cn(
								"hover:underline inline-flex py-0.5 my-1 transition-colors ease-out delay-150 ",
								{
									"text-base": heading.depth === 2,
									"text-sm ml-2": heading.depth === 3,
									"text-sm ml-4": heading.depth === 4,
								},
							)}
						>
							<Link
								data-depth={heading.depth}
								href={`#${heading.slug}`}
								className="text-pretty"
							>
								{heading.text}
							</Link>
						</li>
					))}
			</ol>
		</div>
	);
};
