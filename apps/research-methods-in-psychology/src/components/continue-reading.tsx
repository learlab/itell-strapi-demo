import React from "react";
import { cn } from "@itell/utils";

import { getSession } from "@/lib/auth";
import { firstPage } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import { NavigationButton } from "./navigation-button";
import type { Button } from "@itell/ui/button";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  text?: string;
}

export async function ContinueReading({ text, className, ...rest }: Props) {
  const { user } = await getSession();
  const href = user?.pageSlug ? makePageHref(user.pageSlug) : firstPage.href;
  return (
    <NavigationButton
      href={href}
      size="lg"
      className={cn("p-0", className)}
      {...rest}
    >
      {text ?? (user ? "Continue Reading" : "Start Reading")}
    </NavigationButton>
  );
}
