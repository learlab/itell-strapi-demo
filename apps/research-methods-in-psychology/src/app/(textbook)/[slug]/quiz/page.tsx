import { notFound, redirect } from "next/navigation";
import { PageTitle } from "@itell/ui/page-title";

import { NavigationButton } from "@/components/navigation-button";
import { getSession } from "@/lib/auth";
import { getPageStatus } from "@/lib/page-status";
import { getPageData } from "@/lib/pages/pages.client";
import { firstPage } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import { PageQuiz } from "../_components/page-quiz";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  const page = getPageData(slug);
  if (!page?.quiz) {
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
        <NavigationButton href={makePageHref(user.pageSlug ?? firstPage.slug)}>
          Continue reading
        </NavigationButton>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <PageTitle>{page.title}</PageTitle>
      <h3 className="text-center text-lg text-muted-foreground lg:text-xl">
        Quiz
      </h3>
      <PageQuiz page={page} />
    </div>
  );
}
