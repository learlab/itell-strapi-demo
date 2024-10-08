"use client";

import { useEffect, useMemo, useState, type AnchorHTMLAttributes } from "react";

import { makePageHref } from "@/lib/utils";
import { useLocalStorage } from "@itell/core/hooks";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { pages } from "#content";
import { CheckCircleIcon, CircleIcon } from "lucide-react";
import { toast } from "sonner";

type Props = {
  href: string;
};

function SurveyLink({
  href,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
      {...rest}
    >
      Outtake survey
    </a>
  );
}

export function FinishedLink({ href }: Props) {
  const [visited, setVisited] = useLocalStorage("finished-link-visited", false);

  useEffect(() => {
    if (visited) return;
    toast.info(
      <div className="space-y-2">
        <p>
          Congratulations! You have finished the entire textbook. Visit the link
          below to complete the course.
        </p>
        <SurveyLink
          href={href}
          onClick={() => {
            setVisited(true);
          }}
        />
      </div>,
      {
        duration: 10000,
      }
    );
  }, [visited, href]);

  return (
    <div className="r mb-8 space-y-2 rounded-md border-2 border-info p-4 xl:text-lg xl:leading-relaxed">
      <p>
        You have finished the entire textbook. Please visit the link below to
        complete the course.
      </p>
      <SurveyLink
        href={href}
        onClick={() => {
          setVisited(true);
        }}
      />
      <QuizList />
    </div>
  );
}

function QuizList() {
  const [items, setItems] = useState<
    {
      title: string;
      href: string;
      finished: boolean;
    }[]
  >([]);

  useEffect(() => {
    const pagesWithQuiz = pages.filter((page) => page.quiz);
    const items = pagesWithQuiz.map((p) => {
      const quizFinished = localStorage.getItem(`quiz-finished-${p.slug}`);
      return {
        title: p.title,
        href: `${makePageHref(p.slug)}?quiz=true`,
        finished: quizFinished === "true",
      };
    });
    setItems(items);
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Quizzes Checklist</h3>
      <p className="text-muted-foreground">
        Make sure you finished all the quizzes to get full credit.
      </p>
      <ul className="list-disc pl-4">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="flex items-center gap-2">
              <span>{item.title}</span>
              {item.finished ? (
                <CheckCircleIcon className="size-4 text-green-500" />
              ) : (
                <CircleIcon className="size-4 text-muted-foreground" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
