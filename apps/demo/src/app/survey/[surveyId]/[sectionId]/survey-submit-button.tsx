"use client";

import { Button } from "@itell/ui/button";
import { ChevronRight } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SurveySubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size={"lg"} disabled={pending} pending={pending}>
      <span className="inline-flex items-center gap-1">
        <span>{text}</span>
        <ChevronRight />
      </span>
    </Button>
  );
}
