"use client";

import { useState } from "react";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";

import { createEventAction } from "@/actions/event";
import { NavigationButton } from "@/components/navigation-button";
import { EventType } from "@/lib/constants";
import { type PageData } from "@/lib/pages/pages.client";
import { makePageHref } from "@/lib/utils";

export function PageQuiz({
  page,
  afterSubmit,
}: {
  page: PageData;
  afterSubmit?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!page.quiz || page.quiz.length === 0) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const answers = Array.from(formData.entries()).map(([key, value]) => [
      key,
      String(value),
    ]);
    await createEventAction({
      type: EventType.QUIZ,
      pageSlug: page.slug,
      data: {
        answers,
      },
    });
    setFinished(true);
    setPending(false);
    afterSubmit?.();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {page.quiz.map((item, index) => (
        <div key={index} className="grid gap-2">
          <h4 className="mb-2 text-lg font-semibold">{item.question}</h4>
          <RadioGroup name={index.toString()} required>
            {item.answers.map((answer, answerIndex) => (
              <div
                key={answerIndex}
                className="mb-2 flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={answer.answer}
                  id={`q${String(index)}-a${String(answerIndex)}`}
                />
                <Label htmlFor={`q${String(index)}-a${String(answerIndex)}`}>
                  {answer.answer}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      <footer className="flex justify-end">
        {finished ? (
          page.next_slug ? (
            <NavigationButton href={makePageHref(page.next_slug)}>
              Go to next page
            </NavigationButton>
          ) : (
            <p>You have finished the entire textbook</p>
          )
        ) : (
          <Button pending={pending} disabled={pending}>
            Submit
          </Button>
        )}
      </footer>
    </form>
  );
}
