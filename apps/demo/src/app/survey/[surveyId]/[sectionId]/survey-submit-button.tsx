"use client";

import { Button } from "@itell/ui/button";
import { ChevronRight } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export function SurveySubmitButton({ isLastPage }: { isLastPage: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size={"lg"}
      disabled={pending}
      pending={pending}
      onClick={() => {
        if (isLastPage) {
          toast.success(
            "You have finished the survey. Redirecting you to the textbook."
          );
        }
      }}
    >
      <span className="inline-flex items-center gap-1">
        <span>{isLastPage ? "Finish Survey" : "Save and Next"}</span>
        <ChevronRight />
      </span>
    </Button>
  );
}
