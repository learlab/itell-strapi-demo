import { redirect } from "next/navigation";
import { Card, CardContent } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { SummaryChart } from "@summaries/summary-chart";
import { SummaryList } from "@summaries/summary-list";
import { groupBy } from "es-toolkit";

import { incrementViewAction } from "@/actions/dashboard";
import { getSummariesAction } from "@/actions/summary";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { SummaryListSelect } from "./_components/summary-list-select";

export default async function(props: { searchParams: Promise<unknown> }) {
  const searchParams = await props.searchParams;
  const { user } = await getSession();
  if (!user) {
    return redirect("/auth");
  }

  incrementViewAction({ pageSlug: Meta.summaries.slug });

  const { page } = routes.summaries.$parseSearchParams(searchParams);
  const [summaries, err] = await getSummariesAction({});
  if (err) {
    throw new Error("failed to get summaries", { cause: err });
  }

  const summariesWithPage = summaries
    .map((s) => {
      const page = allPagesSorted.find((page) => page.slug === s.pageSlug);
      if (!page) {
        return undefined;
      }

      return {
        ...s,
        pageTitle: page.title,
      };
    })
    .filter((s) => s !== undefined);

  const summariesByPage = groupBy(
    summariesWithPage,
    (summary) => summary.pageTitle
  );

  const summariesByPassing = summaries.reduce(
    (acc, summary) => {
      if (summary.isPassed) {
        acc.passed += 1;
      } else {
        acc.failed += 1;
      }

      if (summary.updatedAt < acc.startDate) {
        acc.startDate = summary.createdAt;
      }

      if (summary.updatedAt > acc.endDate) {
        acc.endDate = summary.createdAt;
      }

      return acc;
    },
    { passed: 0, failed: 0, startDate: new Date(), endDate: new Date() }
  );
  const chartData = [
    {
      name: "passed",
      value: summariesByPassing.passed,
      fill: "var(--color-passed)",
    },
    {
      name: "failed",
      value: summariesByPassing.failed,
      fill: "var(--color-failed)",
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.summaries.title}
        text={Meta.summaries.description}
      />
      <Card className="w-full">
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <SummaryChart
              data={chartData}
              startDate={summariesByPassing.startDate.toLocaleDateString()}
              endDate={summariesByPassing.endDate.toLocaleDateString()}
              totalCount={summaries.length}
            />
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                <SummaryListSelect defaultValue={page} pages={allPagesSorted} />
                <p className="text-sm text-muted-foreground">
                  {summariesByPassing.passed} passed,{" "}
                  {summariesByPassing.failed} failed
                </p>
              </div>
              {summaries.length > 0 ? (
                <SummaryList data={summariesByPage} />
              ) : (
                <p>No summaries yet.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
