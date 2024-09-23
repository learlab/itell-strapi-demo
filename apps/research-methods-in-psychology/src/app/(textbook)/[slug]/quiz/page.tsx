import { NavigationButton } from "@/components/navigation-button";
import { getSession } from "@/lib/auth";
import { getPageStatus } from "@/lib/page-status";
import { firstPage } from "@/lib/pages";
import { getPageData, makePageHref } from "@/lib/utils";
import { PageTitle } from "@itell/ui/page-title";
import { notFound, redirect } from "next/navigation";
import { PageQuiz } from "../_components/page-quiz";

export default async function ({ params }: { params: { slug: string } }) {
	const { slug } = params;

	const page = getPageData(slug);
	if (!page || !page.quiz) {
		return notFound();
	}

	const { user } = await getSession();
	if (!user) {
		return redirect("/auth");
	}

	const { unlocked, latest } = getPageStatus({
		pageSlug: page.slug,
		userPageSlug: user.pageSlug,
		userFinished: user.finished,
	});
	if (!latest && !unlocked) {
		return (
			<div className="grid gap-6">
				<p>You have not unlocked this page yet.</p>
				<NavigationButton href={makePageHref(user.pageSlug || firstPage.slug)}>
					Continue reading
				</NavigationButton>
			</div>
		);
	}

	return (
		<div className="grid gap-6">
			<PageTitle>{page.title}</PageTitle>
			<h3 className="text-lg lg:text-xl text-muted-foreground text-center">
				Quiz
			</h3>
			<PageQuiz page={page} />
		</div>
	);
}
