import { lucia } from "@/lib/auth/lucia";
import { Condition } from "@/lib/constants";
import { allPagesSorted } from "@/lib/pages";
import { Elements } from "@itell/constants";
import { Skeleton } from "@itell/ui/server";
import { ChapterToc } from "@textbook/chapter-toc";
import { PageTitle } from "@textbook/page-title";
import { BookmarkIcon } from "lucide-react";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function () {
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
	const result = sessionId ? await lucia.validateSession(sessionId) : null;
	const userPageSlug = result?.user?.pageSlug || null;
	const headersList = headers();
	const pathname = headersList.get("x-pathname");
	let pageSlug: string | null = null;
	if (pathname !== null) {
		const split = pathname.split("/");
		if (split.length === 2) {
			pageSlug = split[1];
		}
	}

	// if this is not found, 404 will be throw at page.tsx
	const page = allPagesSorted.find((page) => page.page_slug === pageSlug);
	if (!page) {
		return notFound();
	}

	const arr = Array.from(Array(10).keys());

	return (
		<div className="grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_3.5fr_250px] gap-6">
			<div className="fixed top-16 h-[calc(100vh-3.5rem)] lg:sticky lg:block hidden z-30 border-r-2">
				<div className="h-full w-full px-6 py-6 lg:py-8">
					<ChapterToc
						currentPage={page}
						userPageSlug={userPageSlug}
						userFinished={false}
						userRole="user"
						condition={Condition.STAIRS}
					/>
				</div>
			</div>

			<div className="relative p-4 lg:p-8">
				<PageTitle>{page.title}</PageTitle>

				{arr.map((i) => (
					<Skeleton className="w-full h-28 mb-4" key={i} />
				))}
			</div>

			<aside
				aria-label="table of contents"
				className="hidden md:block relative"
			>
				<div className="sticky top-20 -mt-10 pt-4">
					<div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12 px-4">
						<p className="font-semibold mb-4">
							<span className="flex items-center gap-2">
								<BookmarkIcon className="size-4" />
								On this page
							</span>
						</p>
						<ul className="mt-2 space-y-2">
							{arr.slice(0, 5).map((i) => (
								<Skeleton className="w-36 h-7" key={i} />
							))}
						</ul>
					</div>
				</div>
			</aside>
		</div>
	);
}
