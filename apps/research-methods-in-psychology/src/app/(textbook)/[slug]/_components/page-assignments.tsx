import { Suspense } from "react";

import { Condition } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { getPageData } from "@/lib/pages/pages.client";
import { Elements } from "@itell/constants";
import { Errorbox } from "@itell/ui/callout";
import { type User } from "lucia";

import { FinishedLink } from "./finished-link";
import { FinishedPrompt } from "./finished-prompt";
import { PageQuizModal } from "./page-quiz-modal";
import { SummaryCount } from "./summary/summary-count";
import { SummaryDescription } from "./summary/summary-description";
import { SummaryFormReread } from "./summary/summary-form-reread";
import { SummaryFormSimple } from "./summary/summary-form-simple";
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

  return (
    <section
      className="gird-cols-1 mx-auto mb-20 grid max-w-[1800px] gap-8 border-t-2 p-4 lg:grid-cols-3 lg:p-8"
      id={Elements.PAGE_ASSIGNMENTS}
      aria-labelledby="page-assignments-heading"
    >
      <h2 className="sr-only" id="page-assignments-heading">
        assignments
      </h2>
      {condition === Condition.SIMPLE ? (
        <div className="col-span-full mx-auto max-w-2xl space-y-4">
          <SummaryFormSimple page={page} pageStatus={pageStatus} />
        </div>
      ) : (
        <>
          <div className="col-span-full hidden md:block lg:col-span-1">
            <SummaryDescription condition={condition} />
            {condition !== Condition.SIMPLE && (
              <Suspense fallback={<SummaryCount.Skeleton />}>
                <div className="mt-8">
                  <SummaryCount pageSlug={page.slug} />
                </div>
              </Suspense>
            )}
          </div>

          <div className="col-span-full space-y-2 lg:col-span-2">
            {user.finished ? (
              <Suspense fallback={<FinishedPrompt.Skeleton />}>
                <FinishedPrompt href="https://peabody.az1.qualtrics.com/jfe/form/SV_9zgxet1MhcfKxM2" />
              </Suspense>
            ) : null}
            {condition !== Condition.SIMPLE ? (
              <PageQuizModal page={page} pageStatus={pageStatus} />
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
          </div>
        </>
      )}
    </section>
  );
}
