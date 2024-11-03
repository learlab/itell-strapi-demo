import { notFound, redirect } from "next/navigation";
import { Badge } from "@itell/ui/badge";
import { SummaryBackButton } from "@summary/summary-back-button";
import { SummaryOperations } from "@summary/summary-operations";
import { SummaryReviseButton } from "@summary/summary-revise-button";

import { incrementViewAction } from "@/actions/dashboard";
import { getSummariesAction } from "@/actions/summary";
import { PageLink } from "@/components/page-link";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { allPagesSorted } from "@/lib/pages/pages.server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function(props: PageProps) {
  const params = await props.params;
  const summaryId = Number(params.id);
  const { user } = await getSession();
  if (!user) {
    return redirect("/auth");
  }
  const [data, err] = await getSummariesAction({
    summaryId,
  });

  if (err) {
    throw new Error("failed to get summary", { cause: err });
  }

  if (data.length === 0) {
    return notFound();
  }

  const summary = data[0];
  const page = allPagesSorted.find((page) => page.slug === summary.pageSlug);
  if (!page) {
    return notFound();
  }

  incrementViewAction({ pageSlug: Meta.student.slug, data: { id: user.id } });

  return (
    <>
      <header className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-10">
          <SummaryBackButton />
        </div>
        <SummaryOperations pageHref={page.href} />
      </header>
      <main className="mt-4 grid gap-12 md:grid-cols-[200px_1fr]">
        <div className="w-[200px] space-y-4">
          <p className="sr-only">summary scores</p>
          <div className="flex items-center justify-center">
            <Badge variant={summary.isPassed ? "default" : "destructive"}>
              {summary.isPassed ? "Passed" : "Failed"}
            </Badge>
          </div>
          <p className="text-sm tracking-tight text-muted-foreground">
            Click on the title to review this page's content.
          </p>
        </div>
        <div className="grid gap-2">
          <div className="text-center">
            <PageLink pageSlug={page.slug} className="hover:underline">
              <h1 className="text-2xl font-semibold">{page.title}</h1>
            </PageLink>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Created at <time>{summary.createdAt.toLocaleDateString()}</time>
          </p>

          <div>
            <p className="sr-only">summary text</p>
            <p>{summary.text}</p>
          </div>
          <div className="mt-2 flex justify-end">
            <SummaryReviseButton
              pageSlug={summary.pageSlug}
              text={summary.text}
            />
          </div>
        </div>
      </main>
    </>
  );
}
