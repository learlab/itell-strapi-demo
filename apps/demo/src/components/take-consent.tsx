import { cn } from "@itell/utils";

import { NavigationButton } from "./navigation-button";

export function TakeConsent({ className }: { className?: string }) {
  return (
    <NavigationButton
      href="/consent"
      size={"lg"}
      className={cn("p-0", className)}
    >
      Review Consent Form
    </NavigationButton>
  );
}
