import { redirect } from "next/navigation";
import { Elements } from "@itell/constants";
import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { SummaryChart } from "@summaries/summary-chart";
import { SummaryList } from "@summaries/summary-list";
import { firstPage } from "tests/utils";

import { incrementViewAction } from "@/actions/dashboard";
import { getSummariesAction } from "@/actions/summary";
import { NavigationButton } from "@/components/navigation-button";
import { Meta } from "@/config/metadata";
import { Summary } from "@/drizzle/schema";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { allPagesSorted, firstAssignmentPage } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import { SummaryListSelect } from "./_components/summary-list-select";

export default async function Page(props: { searchParams: Promise<unknown> }) {
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

  if (summaries.length === 0) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading={Meta.summaries.title}
          text={Meta.summaries.description}
        />
        <Card>
          <CardHeader>
            <CardDescription>No summary found.</CardDescription>
          </CardHeader>
          <CardContent>
            <NavigationButton
              href={`${makePageHref(
                user.pageSlug ?? firstAssignmentPage?.slug ?? firstPage.slug
              )}#${Elements.PAGE_ASSIGNMENTS}`}
              className="px-4"
            >
              Write first summary
            </NavigationButton>
          </CardContent>
        </Card>
      </DashboardShell>
    );
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

  const summariesByPage = summariesWithPage.reduce(
    (acc, summary) => {
      if (!acc[summary.pageSlug]) {
        acc[summary.pageSlug] = [];
      }
      acc[summary.pageSlug].push(summary);

      return acc;
    },
    {} as Record<string, Array<Summary & { pageTitle: string }>>
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
                {summariesByPassing.passed} passed, {summariesByPassing.failed}{" "}
                failed
              </p>
            </div>
            <SummaryList data={summariesByPage} />
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
