import { countSummaryByPassingAction } from "@/actions/summary";
import { Skeleton } from "@itell/ui/skeleton";
import Link from "next/link";
import pluralize from "pluralize";

type Props = {
  pageSlug: string;
};

export const SummaryCount = async ({ pageSlug }: Props) => {
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
};

SummaryCount.Skeleton = () => <Skeleton className="h-8 w-48" />;
