import React from "react";
import { cn } from "@itell/utils";
import { User } from "lucia";

import { firstPage } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import { NavigationButton } from "./navigation-button";
import type { Button } from "@itell/ui/button";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  user: User | null;
  text?: string;
  children?: React.ReactNode;
}

export async function ContinueReading({
  user,
  text,
  className,
  children,
  ...rest
}: Props) {
  const href = user?.pageSlug ? makePageHref(user.pageSlug) : firstPage.href;
  return (
    <NavigationButton
      href={href}
      size="lg"
      className={cn("p-0", className)}
      {...rest}
    >
      {children ?? text ?? (user ? "Continue Reading" : "Start Reading")}
    </NavigationButton>
  );
}
