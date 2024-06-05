import { ChapterToc } from "@/components/chapter-toc";
import { PageTitle } from "@/components/page-title";
import { lucia } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";
import { allPagesSorted } from "@/lib/pages";
import { Skeleton } from "@itell/ui/server";
import { BookmarkIcon } from "lucide-react";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function () {
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
	const result = sessionId ? await lucia.validateSession(sessionId) : null;
	const userPageSlug = result?.user?.pageSlug || null;
	const headersList = headers();
	const pathname = headersList.get("x-pathname") as string;
	const split = pathname.split("/");
	let pageSlug: string | null = null;
	if (split.length === 2) {
		pageSlug = split[1];
	}

	// if this is not found, 404 will be throw at page.tsx
	const page = allPagesSorted.find((page) => page.page_slug === pageSlug);
	if (!page) {
		return notFound();
	}

	const arr = Array.from(Array(10).keys());

	return (
		<div className="flex flex-row max-w-[1440px] mx-auto gap-6 px-2">
			<aside
				className="chapter-sidebar sticky top-20 h-fit z-20 basis-0"
				style={{ flexGrow: 1 }}
			>
				<ChapterToc
					currentPage={page}
					userPageSlug={userPageSlug}
					userFinished={false}
					userRole="user"
					userId={null}
					condition={Condition.STAIRS}
				/>
			</aside>

			<section
				className="page-content relative space-y-4"
				style={{ flexGrow: 4 }}
			>
				<PageTitle>{page.title}</PageTitle>

				{arr.map((i) => (
					<Skeleton className="w-full h-28 mb-4" key={i} />
				))}
			</section>

			<aside className="toc-sidebar relative" style={{ flexGrow: 1 }}>
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
		</div>
	);
}
