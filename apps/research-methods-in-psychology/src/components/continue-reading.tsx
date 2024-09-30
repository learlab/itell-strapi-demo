import React from "react";

import { getSession } from "@/lib/auth";
import { firstPage } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import type { Button } from "@itell/ui/button";

import { NavigationButton } from "./navigation-button";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  text?: string;
}

export async function ContinueReading({ text, ...rest }: Props) {
  const { user } = await getSession();
  const href = user?.pageSlug ? makePageHref(user.pageSlug) : firstPage.href;
  return (
    <NavigationButton href={href} size="lg" {...rest}>
      {text ?? (user ? "Continue Reading" : "Start Reading")}
    </NavigationButton>
  );
}
