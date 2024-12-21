import { Spinner } from "@itell/ui/spinner";
import { CheckCircleIcon, CircleIcon } from "lucide-react";

import { getUserQuizAttempts } from "@/actions/event";
import { quizPages } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import { FinishedLink } from "./finished-link";

type Props = {
  href: string;
};

export async function FinishedPrompt({ href }: Props) {
  const [attempts, err] = await getUserQuizAttempts();
  if (err) {
    return (
      <div className="mb-8 space-y-4 rounded-md border-2 border-info p-4 xl:text-lg xl:leading-relaxed">
        <p>
          You have finished the textbook, but we failed to get your quiz
          completion status at this point. You can still visit the link below to
          complete the course.
        </p>
        <FinishedLink href={href} />
      </div>
    );
  }
  const pages = quizPages.map((p) => ({
    title: p.title,
    href: `${makePageHref(p.slug)}?quiz=true`,
    finished: attempts.find((a) => a.pageSlug === p.slug) !== undefined,
  }));

  const allQuizFinished = pages.every((p) => p.finished);

  return (
    <div className="mb-8 space-y-6 rounded-md border-2 border-info p-4 xl:text-lg xl:leading-relaxed">
      {allQuizFinished ? (
        <>
          <p>
            Congratulations! You have finished the entire textbook. Please
            complete the outtake survey to finish the course.
          </p>
          <FinishedLink href={href} />
        </>
      ) : (
        <p>
          Congratulations! You have finished the entire textbook. Please also
          make sure you finished all the following quizzes to get full credit.
          Once you finished all the quizzes, you will get a link to complete the
          course.
        </p>
      )}
      <QuizList pages={pages} />
    </div>
  );
}

function QuizList({
  pages,
}: {
  pages: { title: string; href: string; finished: boolean }[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quiz Checklist</h3>
      <p className="text-muted-foreground">
        Make sure you finished all the quizzes to get full credit.
      </p>
      <ul className="pl-4">
        {pages.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="flex items-center gap-2">
              {item.finished ? (
                <CheckCircleIcon className="size-4 text-green-500" />
              ) : (
                <CircleIcon className="size-4 text-muted-foreground" />
              )}
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

FinishedPrompt.Skeleton = function () {
  return (
    <div className="mb-8 space-y-6 rounded-md border-2 border-info p-4 xl:text-lg xl:leading-relaxed">
      <p className="flex items-center gap-2">
        <Spinner className="size-4" />
        <span>checking completion status</span>
      </p>
    </div>
  );
};
