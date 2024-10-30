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
      className="text-pretty text-sm font-medium underline-offset-4 hover:underline xl:text-base"
      href="/dashboard/summaries"
      aria-label="past summary submissions for this page"
    >
      <p>
        You have written {pluralize("summary", summaryCount, true)} for this
        section.
        {summaryCount > 0 && (
          <span className="ml-1">
            {data.passed} passed, {data.failed} failed.
          </span>
        )}
      </p>
    </Link>
  );
}

SummaryCount.Skeleton = function () {
  return <Skeleton className="h-8 w-48" />;
};
