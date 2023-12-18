// @ts-nocheck
import { Skeleton } from "@itell/ui/server";
import { getChapterFromPathname } from "@/lib/utils";
import { BookmarkIcon } from "lucide-react";
import { headers } from "next/headers";
import { allChaptersSorted } from "@/lib/chapters";
import { PageTitle } from "@/components/page-title";

export default async function () {
	const headersList = headers();
	const chapter = getChapterFromPathname(
		headersList.get("x-pathname") as string,
	);
	const title = allChaptersSorted.find((c) => c.chapter === chapter)
		?.title as string;
	return (
		<>
			<section className="relative col-span-12 md:col-span-10 lg:col-span-8 space-y-4">
				<PageTitle>{title}</PageTitle>

				{Array.from({ length: 10 }).map((_, index) => (
					<Skeleton className="w-full h-28 mb-4" key={index} />
				))}
			</section>

			<aside className="toc-sidebar col-span-2 relative">
				<p className="font-medium text-sm flex items-center">
					<span>ON THIS PAGE</span>
					<BookmarkIcon className="ml-2 w-4 h-4" />
				</p>
				<ul className="mt-2 space-y-2">
					{Array.from({ length: 5 }).map((_, index) => (
						<Skeleton className="w-32 h-7" key={index} />
					))}
				</ul>
			</aside>
		</>
	);
}
