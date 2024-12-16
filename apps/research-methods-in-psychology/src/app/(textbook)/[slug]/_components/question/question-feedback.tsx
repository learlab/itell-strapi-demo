"use client";

import { useState } from "react";
import { Button } from "@itell/ui/button";
import { Checkbox } from "@itell/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@itell/ui/dialog";
import { Label } from "@itell/ui/label";
import { TextArea } from "@itell/ui/textarea";
import {
  MessageCircleCodeIcon,
  SendHorizontalIcon,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import { createQuestionFeedbackAction } from "@/actions/question";
import { InternalError } from "@/components/internal-error";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";

type Props = {
  chunkSlug: string;
  pageSlug: string;
};

export function QuestionFeedback({ pageSlug, chunkSlug }: Props) {
  const [isPositive, setIsPositive] = useState(true);
  const allTags = isPositive
    ? ["informative", "supportive", "helpful"]
    : ["nonsensical", "inaccurate", "harmful"];
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const { isError, execute } = useServerAction(createQuestionFeedbackAction);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          setOpen(true);
        }}
      >
        <button type="button" aria-label="Provide feedback">
          <MessageCircleCodeIcon className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="grid gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setPending(true);
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const text = String(formData.get("text"));
            const tags = [];
            for (const tag of allTags) {
              if (data[tag] === "on") {
                tags.push(tag);
              }
            }
            const [_, err] = await execute({
              text,
              chunkSlug,
              pageSlug,
              isPositive,
              tags,
            });
            if (!err) {
              setOpen(false);
              toast.success(
                "Thanks for your feedback. We'll review it shortly."
              );
            }
            setPending(false);
          }}
        >
          <DialogTitle>Was the feedback helpful?</DialogTitle>
          <RadioGroup
            name="is-helpful"
            className="flex gap-4"
            required
            value={isPositive ? "yes" : "no"}
            onValueChange={(value) =>
              setIsPositive(value === "yes" ? true : false)
            }
          >
            <Label className="flex items-center gap-2">
              <RadioGroupItem value="yes" />
              <span>Yes</span>
            </Label>
            <Label className="flex items-center gap-2">
              <RadioGroupItem value="no" />
              <span>No</span>
            </Label>
          </RadioGroup>

          <Label>
            <span className="sr-only">Your feedback</span>
            <TextArea
              name="text"
              rows={3}
              placeholder="Tell us more about your experience and how we may improve iTELL AI."
            />
          </Label>

          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm">
              (Optional) Select the tags that best describe the feedback:
            </p>
            {allTags.map((tag) => (
              <Label key={tag} className="inline-flex items-center gap-2">
                <Checkbox name={tag} />
                <span>{tag}</span>
              </Label>
            ))}
          </div>
          {isError ? (
            <InternalError>
              <p>Failed to submit feedback, please try again later.</p>
            </InternalError>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={pending} pending={pending}>
              <span className="flex items-center gap-2">
                <SendHorizontalIcon className="size-4" />
                Submit feedback
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
