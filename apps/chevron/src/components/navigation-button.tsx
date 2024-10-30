"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@itell/core/hooks";
import { type Button } from "@itell/ui/button";
import { StatusButton } from "@itell/ui/status-button";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode;
  href: string;
}

export function NavigationButton({ children, href, onClick, ...props }: Props) {
  const [pending, startTransition] = useTransition();
  const pendingDebounced = useDebounce(pending, 100);
  const router = useRouter();
  return (
    <StatusButton
      pending={pendingDebounced}
      disabled={pending}
      size="lg"
      {...props}
      onClick={(e) => {
        startTransition(() => {
          onClick?.(e);
          router.push(href);
        });
      }}
    >
      {children}
    </StatusButton>
  );
}
