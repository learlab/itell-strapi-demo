import { Button } from "@itell/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itell/ui/hover-card";
import { type User } from "lucia";
import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";

import { getPageStatus } from "@/lib/page-status";

type Props = {
  user: User | null;
  pageSlug: string;
};

export function PageStatusInfo({ user, pageSlug }: Props) {
  const status = getPageStatus({
    pageSlug,
    userPageSlug: user?.pageSlug ?? null,
    userFinished: user?.finished ?? false,
  });

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button className="px-0 text-left text-sm" variant="link">
          {status.unlocked ? (
            <span>
              <UnlockIcon className="mr-1 inline size-4" />
              Unlocked
            </span>
          ) : status.latest ? (
            <span>
              <EyeIcon className="mr-1 inline size-4" />
              In progress
            </span>
          ) : (
            <span>
              <LockIcon className="mr-1 inline size-4" />
              Locked
            </span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-48 text-sm">
        {status.latest
          ? "Answer questions and summarize this chapter to move forward"
          : status.unlocked
            ? "You have completed this page. You can now view all its content"
            : "You haven't got access to this page yet"}
      </HoverCardContent>
    </HoverCard>
  );
}
