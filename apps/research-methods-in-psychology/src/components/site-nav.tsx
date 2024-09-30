import React from "react";

import { Elements } from "@itell/constants";
import { cn } from "@itell/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  mainContentId?: string;
  children: React.ReactNode;
}

export function SiteNav({
  children,
  className,
  mainContentId,
  ...rest
}: Props) {
  return (
    <header
      id={Elements.SITE_NAV}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...rest}
    >
      <div className="skip-links">
        <a className="skip-link" href={`#${mainContentId ?? ""}`}>
          skip to main content
        </a>
      </div>
      {children}
    </header>
  );
}
