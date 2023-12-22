import { getCurrentUser } from "@/lib/auth";
import { isPageAfter, isPageUnlockedWithoutUser } from "@/lib/location";
import { allPagesSorted } from "@/lib/pages";
import { getUser } from "@/lib/user";
import { makePageHref } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageStatusModal } from "@/components/page-status/page-status-modal";
import { isProduction } from "@/lib/constants";
import { QuizProvider } from "@/components/context/quiz-context";
import { Quiz } from "@/components/quiz/quiz";
import { Suspense } from "react";

type Props = {
	params: {
		slug: string;
	};
};

const NoQuiz = ({ pageSlug }: { pageSlug: string }) => {
	return (
		<p>
			No Quiz is found. Go back to the{" "}
			<Link href={makePageHref(pageSlug)}>page</Link>.
		</p>
	);
};

export default async function ({ params }: Props) {
	const pageSlug = params.slug;
	const pageIndex = allPagesSorted.findIndex(
		(page) => page.page_slug === pageSlug,
	);

	if (pageIndex === -1) {
		return notFound();
	}

	const page = allPagesSorted[pageIndex];
	// const sessionUser = await getCurrentUser();
	// const user = sessionUser ? await getUser(sessionUser.id) : null;
	// const isPageVisible = user
	// 	? !isPageAfter(pageSlug, user.pageSlug)
	// 	: isPageUnlockedWithoutUser(pageSlug);

	// if (isProduction && !isPageVisible) {
	// 	return <PageStatusModal user={user} pageSlug={pageSlug} />;
	// }

	const hasQuiz = page.quiz;
	if (!hasQuiz) {
		return <NoQuiz pageSlug={pageSlug} />;
	}

	return (
		<QuizProvider>
			<div className="col-span-5 space-y-4">
				<p className="font-light leading-snug">
					Finish the following quiz before moving to the next page
				</p>
				<Suspense fallback={<Quiz.Skeleton />}>
					<Quiz pageSlug={pageSlug} />
				</Suspense>
			</div>
		</QuizProvider>
	);
}
