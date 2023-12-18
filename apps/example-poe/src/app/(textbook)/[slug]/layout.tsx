// @ts-nocheck
import { ModuleSidebar } from "@/components/module-sidebar";
import { PageSummary } from "@/components/summary/page-summary";
import { allChaptersSorted } from "@/lib/chapters";
import { cn } from "@itell/core/utils";
import { buttonVariants } from "@itell/ui/server";
import { ArrowUpIcon, PencilIcon } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const generateStaticParams = async () => {
	return allChaptersSorted.map((chapter) => {
		return {
			slug: chapter.url,
		};
	});
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const chapter = allChaptersSorted.find(
		(chapter) => chapter.url === params.slug,
	);
	if (chapter) {
		return {
			title: chapter.title,
			description: chapter.body.raw.slice(0, 80),
		};
	}
};

const AnchorLink = ({
	text,
	href,
	icon,
}: { text: string; href: string; icon: React.ReactNode }) => (
	<a
		href={href}
		className={cn(
			buttonVariants({ size: "sm", variant: "ghost" }),
			"flex justify-start items-center gap-2 mb-0 py-1",
		)}
	>
		{icon}
		<span>{text}</span>
	</a>
);

// this layout specifies the following structure
// <container>
// 	    <left-aside>
// 		    <ModuleSidebar />
// 	    </left-aside>
//
//      {children}
//      <Summary />
// 	<container>

export default async function ({
	children,
	params,
}: { children: React.ReactNode; params: { slug: string } }) {
	const isDev = process.env.NODE_ENV === "development";
	const url = params.slug;
	const chapterIndex = allChaptersSorted.findIndex((section) => {
		return section.url === url;
	});

	if (chapterIndex === -1) {
		return notFound();
	}
	const chapter = allChaptersSorted[chapterIndex];
	const requireSummary = chapter.summary;

	return (
		<>
			<div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-6 px-2">
				<aside className="module-sidebar md:col-span-2">
					<div className="sticky top-20">
						<ChapterSidebar
							currentChapter={chapter.chapter}
							chapters={allChaptersSorted}
						/>
						<div className="mt-12 flex flex-col gap-2">
							{requireSummary && (
								<AnchorLink
									icon={<PencilIcon className="w-4 h-4" />}
									text="Write a summary"
									href="#page-summary"
								/>
							)}
							<AnchorLink
								icon={<ArrowUpIcon className="w-4 h-4" />}
								text="Back to top"
								href="#page-title"
							/>
						</div>
					</div>
				</aside>

				{children}
			</div>

			{requireSummary && <PageSummary chapter={chapter.chapter} />}
		</>
	);
}
