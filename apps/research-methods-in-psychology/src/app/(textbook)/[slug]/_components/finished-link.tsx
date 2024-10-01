"use client";

import { AnchorHTMLAttributes, useEffect } from "react";

import { useLocalStorage } from "@itell/core/hooks";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
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
        duration: 20000,
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
    </div>
  );
}
