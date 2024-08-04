import { lucia } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";
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
		<main id={Elements.TEXTBOOK_MAIN_WRAPPER}>
			<div id={Elements.TEXTBOOK_NAV}>
				<div className="h-full w-full px-6 py-6 lg:py-8">
					<ChapterToc
						userId={null}
						currentPage={page}
						userPageSlug={userPageSlug}
						userFinished={false}
						userRole="user"
						condition={Condition.STAIRS}
					/>
				</div>
			</div>

			<div id={Elements.TEXTBOOK_MAIN}>
				<PageTitle>{page.title}</PageTitle>

				{arr.map((i) => (
					<Skeleton className="w-full h-28 mb-4" key={i} />
				))}
			</div>

			<aside id={Elements.PAGE_NAV} aria-label="table of contents">
				<div className="sticky top-20 -mt-10 pt-4">
					<div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12 px-4">
						<p
							id="page-toc-heading"
							className="font-semibold mb-4"
							role="heading"
							aria-level={2}
						>
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
		</main>
	);
}
