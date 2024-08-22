import { PageCard } from "@/components/page-card";
import { Preview } from "@/components/preview";
import { PageToc } from "@/components/ui/page-toc";
import { routes } from "@/lib/navigation";
import { getPage } from "@/lib/strapi";
import { extractHeadingsFromMdast } from "@itell/content";
import { buttonVariants } from "@itell/ui/button";
import { ScrollArea } from "@itell/ui/scroll-area";
import { cn } from "@itell/utils";
import { fromMarkdown } from "mdast-util-from-markdown";
import Link from "next/link";

export default async function ({ searchParams }: { searchParams: unknown }) {
	const { page } = routes.preview.$parseSearchParams(searchParams);
	const data = await getPage(page);
	if (!data) {
		throw "page not found";
	}

	const html = data.content.join("\n");
	const headings = extractHeadingsFromMdast(fromMarkdown(html));

	return (
		<div className="grid grid-cols-3 gap-8 items-start">
			<Preview className="min-h-[50vh] col-span-2" html={html} />
			<div className="flex flex-col gap-4 h-full">
				<div className="flex flex-col gap-2">
					<PageCard title={data.title} volume={data.volume} />
					<Link
						href={`/?page=${page}`}
						className={cn(buttonVariants({ variant: "secondary" }))}
					>
						Home
					</Link>
				</div>
				<div className="sticky top-0">
					<ScrollArea className="max-h-[80vh] overflow-y-auto">
						<PageToc headings={headings} />
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
