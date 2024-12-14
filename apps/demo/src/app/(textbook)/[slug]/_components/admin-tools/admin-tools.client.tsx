"use client";

import { startTransition, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@itell/ui/alert-dialog";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { ScrollArea } from "@itell/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@itell/ui/sheet";
import { Switch } from "@itell/ui/switch";
import { type Page } from "#content";
import { type User } from "lucia";
import { SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import { resetUserAction, updateUserAction } from "@/actions/user";
import { InternalError } from "@/components/internal-error";
import { useQuestionStore } from "@/components/provider/page-provider";
import { getUserCondition } from "@/lib/auth/conditions";
import { Condition } from "@/lib/constants";
import { updatePersonalizationSummaryStreak } from "@/lib/personalization";
import { makePageHref } from "@/lib/utils";

type Props = {
  user: User;
  pageSlug: string;
  pages: Page[];
};

const conditions = [
  {
    label: "Simple",
    description:
      "No question and summary. Workers will read short questions and their correct answers and read professional summaries of the chapter. Workers will also read about strategies that can increase text comprehension.",
    value: Condition.SIMPLE,
  },
  {
    label: "Random rereading",
    description:
      "With question and summary, but no feedback on correctness. Can revise question answer. After writing a summary, workers will receive a random chunk to reread without stairs.",
    value: Condition.RANDOM_REREAD,
  },
  {
    label: "Stairs",
    description:
      "With question and summary, and feedback on correctness. User will interact with stairs for failing summaries.",
    value: Condition.STAIRS,
  },
];

export function AdminToolsClient({ user, pageSlug, pages }: Props) {
  const store = useQuestionStore();
  const condition = getUserCondition(user, pageSlug);
  const [open, setOpen] = useState(false);
  const { execute, isPending, isError } = useServerAction(updateUserAction);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPageSlug =
      formData.get("page-progress") !== ""
        ? String(formData.get("page-progress"))
        : undefined;

    let newSummaryStreak =
      formData.get("summary-streak") !== ""
        ? Number(formData.get("summary-streak"))
        : 0;

    // subtract one since we'll be treating things as if a new passing summary has been submitted
    newSummaryStreak = (newSummaryStreak ?? 0) - 1;

    if (formData.get("page-unblur") === "on") {
      startTransition(() => {
        store.send({ type: "finishPage" });
      });
    }

    const newCondition = String(formData.get("condition"));
    const newConditionAssignments = {
      ...user.conditionAssignments,
      [pageSlug]: newCondition,
    };

    if (user.personalization) {
      user.personalization.summary_streak = newSummaryStreak;
    } else {
      user.personalization = {
        summary_streak: newSummaryStreak,
      } as User["personalization"];
    }

    const newPersonalization = updatePersonalizationSummaryStreak(user, {
      isSummaryPassed: true,
    });

    const [_, err] = await execute({
      conditionAssignments: newConditionAssignments,
      pageSlug: newPageSlug,
      // always set finished to false, some changes are not shown for a finished user
      finished: false,
      personalization: newPersonalization,
    });
    if (!err) {
      setOpen(false);
      if (newPageSlug) {
        window.location.href = makePageHref(newPageSlug);
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-start p-2 xl:text-lg"
        >
          <span className="inline-flex items-center gap-2 xl:gap-4">
            <SettingsIcon className="size-4 xl:size-6" />
            <span>Admin tools</span>
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Configure ITELL</SheetTitle>
          <SheetDescription className="text-left">
            You can view this because you are recognized as an admin. Apply the
            configuration by clicking &quot;Save Changes&quot;.
          </SheetDescription>
        </SheetHeader>
        <form className="grid gap-8 py-4" onSubmit={onSubmit}>
          <fieldset className="flex flex-col border p-4">
            <legend className="font-semibold">Feedback</legend>
            <RadioGroup
              className="space-y-4"
              name="condition"
              defaultValue={condition}
              aria-label="Select feedback type"
            >
              {conditions.map(({ label, description, value }) => (
                <Label
                  key={label}
                  className="flex items-center justify-between gap-6 font-normal"
                >
                  <div className="space-y-2 text-balance">
                    <p className="font-semibold">{label}</p>
                    <p
                      className="text-sm text-muted-foreground"
                      id={`desc-${value}`}
                    >
                      {description}
                    </p>
                  </div>
                  <RadioGroupItem
                    className="shrink-0"
                    value={value}
                    aria-describedby={`desc-${value}`}
                  />
                </Label>
              ))}
            </RadioGroup>
          </fieldset>

          <fieldset className="flex flex-col gap-4 border p-4">
            <legend className="font-semibold">Progress</legend>
            <Label className="flex flex-col gap-2 font-normal">
              <p className="font-semibold">Set your progress to a page</p>
              <Select name="page-progress">
                <SelectTrigger className="h-fit text-left">
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Page</SelectLabel>
                    <ScrollArea className="h-[300px]">
                      {pages.map((page) => (
                        <SelectItem key={page.slug} value={page.slug}>
                          {page.title}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Label>
            <Label className="flex items-center justify-between gap-6 font-normal">
              <div className="flex flex-col gap-2 text-balance">
                <p className="font-semibold">Unblur current page</p>
                <p className="text-sm text-muted-foreground" id="unblur-desc">
                  Unblur all chunks from the current page and unlock summary
                  submission
                </p>
              </div>
              <Switch name="page-unblur" aria-describedby="unblur-desc" />
            </Label>
            <RestartTextbook />
          </fieldset>

          <fieldset className="flex flex-col gap-4 border p-4">
            <legend className="font-semibold">Streak</legend>
            <Label className="flex flex-col gap-2 font-normal">
              <p className="font-semibold">Set your summary streak</p>
              <Select name="summary-streak">
                <SelectTrigger className="h-fit text-left">
                  <SelectValue placeholder="Select summary streak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Streak count</SelectLabel>
                    {Array.from({ length: 10 }, (_, i) => i).map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Label>
          </fieldset>

          <footer className="flex justify-end">
            <Button type="submit" disabled={isPending} pending={isPending}>
              Save changes
            </Button>
          </footer>

          {isError ? <InternalError /> : null}
        </form>
      </SheetContent>
    </Sheet>
  );
}

function RestartTextbook() {
  const { isPending, isError, execute } = useServerAction(resetUserAction);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Restart textbook</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">
                This action will reset your progress to the first page and
                delete all of your data, including summaries, chat messages,
                question answers, etc.
              </p>
              {isError ? <InternalError /> : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={async () => {
              const [data, err] = await execute();
              if (err) {
                return toast.error(err.data);
              }
              localStorage.clear();
              window.location.href = data.pageSlug
                ? makePageHref(data.pageSlug)
                : "/";
            }}
            pending={isPending}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
