import Link from "next/link";
import { Skeleton } from "@itell/ui/skeleton";
import pluralize from "pluralize";

import { countSummaryByPassingAction } from "@/actions/summary";

type Props = {
  pageSlug: string;
};

export async function SummaryCount({ pageSlug }: Props) {
  const [data, err] = await countSummaryByPassingAction({ pageSlug });
  if (err) {
    return null;
  }
  const summaryCount = data.failed + data.passed;

  return (
    <Link
      className="text-sm text-muted-foreground underline-offset-4 hover:underline xl:text-base"
      href="/dashboard/summaries"
      aria-label="past summary submissions for this page"
    >
      <span>
        {pluralize("summary", summaryCount, true)} were written
        {summaryCount > 0 ? (
          <span>
            {", "}
            {data.passed} passed, {data.failed} failed.
          </span>
        ) : null}
      </span>
    </Link>
  );
}

SummaryCount.Skeleton = function () {
  return <Skeleton className="h-8 w-48" />;
};
