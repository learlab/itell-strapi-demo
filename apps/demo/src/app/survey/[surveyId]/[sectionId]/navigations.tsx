"use client";

import { useRouter } from "next/navigation";
import { Button } from "@itell/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { routes, useSafeParams } from "@/lib/navigation";
import { getNextSection, getPreviousSection } from "./data";

export function ForwardButton() {
  const { sectionId, surveyId } = useSafeParams("surveySection");
  const router = useRouter();
  const move = async () => {
    const loc = getNextSection({ surveyId, sectionId });
    if (loc) {
      router.push(
        routes.surveySection({
          sectionId: loc.id,
          surveyId,
        })
      );
    }
  };

  return (
    <Button onClick={move}>
      <ArrowRight className="size-4" />
    </Button>
  );
}

export function BackButton() {
  const { sectionId, surveyId } = useSafeParams("surveySection");
  const router = useRouter();
  const move = async () => {
    const loc = getPreviousSection({ surveyId, sectionId });
    if (loc) {
      router.push(
        routes.surveySection({
          sectionId: loc.id,
          surveyId,
        })
      );
    }
  };

  return (
    <Button onClick={move}>
      <ArrowLeft className="size-4" />
    </Button>
  );
}
