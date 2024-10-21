"use client";

import { useTransition } from "react";
import { Button } from "@itell/ui/button";
import { RotateCcwIcon } from "lucide-react";

import { useQuestionStore } from "@/components/provider/page-provider";
import { clearSummaryLocal } from "../summary/summary-input";

export function RestartPageButton({ pageSlug }: { pageSlug: string }) {
  const [pending, startTransition] = useTransition();
  const store = useQuestionStore();
  return (
    <Button
      className="flex w-full items-center justify-start p-2 xl:text-lg"
      variant="ghost"
      onClick={() => {
        startTransition(() => {
          store.send({ type: "resetPage" });
          clearSummaryLocal(pageSlug);
          window.location.reload();
        });
      }}
      disabled={pending}
      pending={pending}
    >
      <span className="flex w-full items-center justify-start gap-2 py-2 xl:gap-4">
        <RotateCcwIcon className="size-4 xl:size-6" />
        Reset
      </span>
    </Button>
  );
}
