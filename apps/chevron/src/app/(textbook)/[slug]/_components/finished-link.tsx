"use client";

import { useEffect } from "react";
import { useLocalStorage } from "@itell/core/hooks";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { toast } from "sonner";
import type { AnchorHTMLAttributes } from "react";
import { useRouter } from "next/router";

type Props = {
  href: string;
};

export function FinishedLink({ href }: Props) {
  router = useRouter();
  const [visited, setVisited] = useLocalStorage("finished-link-visited", false);

  useEffect(() => {
    if (visited) return;
    toast.info(
      <div className="space-y-2">
        <p>
          Congratulations! You have finished the entire textbook. Please complete the outtake survey 
          to finish the course.
        </p>
      </div>,
      {
        duration: 10000,
      }
    );  
  }, [visited, href]);

  router.push("/outtake");
}
