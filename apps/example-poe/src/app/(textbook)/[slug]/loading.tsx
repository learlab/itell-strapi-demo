import { Skeleton } from "@itell/ui/server";
import { BookmarkIcon } from "lucide-react";
import { headers } from "next/headers";
import { getLocationFromPathname } from "@/lib/utils";
import { PageTitle } from "@/components/page-title";
import { allSectionsSorted } from "@/lib/sections";

export default async function () {
	const headersList = headers();
	const location = getLocationFromPathname(
		headersList.get("x-pathname") as string,
	);
	const title = allSectionsSorted.find(
		(s) =>
			s.location.chapter === location.chapter &&
			s.location.section === location.section,
	)?.title as string;

	const arr = Array.from(Array(10).keys());

	return (
		<>
			<section className="relative col-span-12 md:col-span-10 lg:col-span-8 space-y-4">
				<PageTitle>{title}</PageTitle>

				{arr.map((i) => (
					<Skeleton className="w-full h-28 mb-4" key={i} />
				))}
			</section>

			<aside className="toc-sidebar col-span-2 relative">
				<p className="font-medium text-sm flex items-center">
					<span>ON THIS PAGE</span>
					<BookmarkIcon className="ml-2 size-4" />
				</p>
				<ul className="mt-2 space-y-2">
					{arr.slice(0, 5).map((i) => (
						<Skeleton className="w-32 h-7" key={i} />
					))}
				</ul>
			</aside>
		</>
	);
}
