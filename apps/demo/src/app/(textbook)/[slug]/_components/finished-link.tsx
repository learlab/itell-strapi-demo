"use client";

import { useEffect } from "react";
import { useLocalStorage } from "@itell/core/hooks";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { toast } from "sonner";

import type { AnchorHTMLAttributes } from "react";

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
      Outtake Survey
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
          Congratulations! You have finished the entire textbook. Please
          complete the outtake survey to finish the course.
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
    <SurveyLink
      href={href}
      onClick={() => {
        setVisited(true);
      }}
    />
  );
}
