import { Suspense } from "react";
import { Elements } from "@itell/constants";
import { Errorbox } from "@itell/ui/callout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { type User } from "lucia";

import { Condition } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { getPageData } from "@/lib/pages/pages.server";
import { FinishedPrompt } from "./finished-prompt";
import { PageQuizModal } from "./page-quiz-modal";
import { SummaryCount } from "./summary/summary-count";
import { SummaryDescription } from "./summary/summary-description";
import { SummaryFormReread } from "./summary/summary-form-reread";
import { SummaryFormSimple } from "./summary/summary-form-simple";
import { SummaryFormSkip } from "./summary/summary-form-skip";
import { SummaryFormStairs } from "./summary/summary-form-stairs";

type Props = {
  pageSlug: string;
  pageStatus: PageStatus;
  user: User;
  condition: string;
};

export function PageAssignments({
  pageSlug,
  pageStatus,
  user,
  condition,
}: Props) {
  const page = getPageData(pageSlug);
  if (!page) {
    return <Errorbox>failed to load assignments</Errorbox>;
  }

  const canSkipSummary = user.personalization.available_summary_skips > 0;

  if (canSkipSummary) {
    return (
      <AssignmentsShell>
        <Card className="border-info">
          <CardContent>
            <SummaryFormSkip
              pageStatus={pageStatus}
              page={page}
              streak={user.personalization.summary_streak}
            />
          </CardContent>
        </Card>
      </AssignmentsShell>
    );
  }

  return (
    <section
      id={Elements.PAGE_ASSIGNMENTS}
      aria-labelledby="page-assignments-heading"
      className="mt-12"
    >
      <h2 className="sr-only" id="page-assignments-heading">
        assignments
      </h2>
      <Card className="border-info">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">Summary</CardTitle>
          <CardDescription>
            You can unlock the next page by submitting{" "}
            <span className="font-bold underline decoration-warning decoration-dashed decoration-4 underline-offset-4">
              a good summary
            </span>{" "}
            of this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.finished ? (
            <Suspense fallback={<FinishedPrompt.Skeleton />}>
              <FinishedPrompt href="https://peabody.az1.qualtrics.com/jfe/form/SV_9zgxet1MhcfKxM2" />
            </Suspense>
          ) : null}
          {condition !== Condition.SIMPLE ? (
            <PageQuizModal page={page} pageStatus={pageStatus} />
          ) : null}
          {condition === Condition.SIMPLE ? (
            <SummaryFormSimple page={page} pageStatus={pageStatus} />
          ) : null}
          {condition === Condition.RANDOM_REREAD ? (
            <SummaryFormReread
              user={user}
              page={page}
              pageStatus={pageStatus}
            />
          ) : condition === Condition.STAIRS ? (
            <SummaryFormStairs
              user={user}
              page={page}
              pageStatus={pageStatus}
            />
          ) : null}
          {condition !== Condition.SIMPLE ? (
            <>
              <Suspense fallback={<SummaryCount.Skeleton />}>
                <SummaryCount pageSlug={pageSlug} />
              </Suspense>
              <SummaryDescription condition={condition} />
            </>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

function AssignmentsShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      id={Elements.PAGE_ASSIGNMENTS}
      aria-labelledby="page-assignments-heading"
      className="mt-12"
    >
      <h2 className="sr-only" id="page-assignments-heading">
        assignments
      </h2>
      {children}
    </section>
  );
}
