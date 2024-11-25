"use client";

import { Elements } from "@itell/constants";
import { Button } from "@itell/ui/button";
import { useSelector } from "@xstate/store/react";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectStairsReady } from "@/lib/store/chat-store";

type Props = {
  onClick: () => void;
};

export function StairsReadyButton({ onClick }: Props) {
  const store = useChatStore();
  const ready = useSelector(store, SelectStairsReady);
  return (
    <Button
      size="sm"
      variant="outline"
      className="bg-background text-foreground duration-200 ease-out animate-out"
      id={Elements.STAIRS_READY_BUTTON}
      onClick={onClick}
      disabled={ready}
    >
      I&apos;m ready for question
    </Button>
  );
}
