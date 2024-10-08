import { cn } from "@itell/utils";
import { BanIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "./button.js";

export type PageLinkData = {
  text: string;
  href: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  prev: PageLinkData | null;
  next: PageLinkData | null;
}

function PageLink({ text, href, icon, disabled }: PageLinkData) {
  return (
    <Button variant="outline" disabled={disabled} className="h-fit max-w-sm">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-pretty font-light leading-relaxed"
      >
        {icon}
        {text}
      </Link>
    </Button>
  );
}

export function Pager({ prev, next, ...rest }: Props) {
  return (
    <div
      className={cn("mt-5 flex flex-row items-center justify-between", {
        "justify-end": next && !prev,
        "justify-start": prev && !next,
      })}
      {...rest}
    >
      {prev ? (
        <PageLink
          text={prev.text}
          href={prev.href}
          disabled={prev.disabled}
          icon={
            prev.icon ? (
              prev.icon
            ) : prev.disabled ? (
              <BanIcon className="mr-2 size-4" />
            ) : (
              <ChevronLeftIcon className="mr-2 size-4" />
            )
          }
        />
      ) : null}
      {next ? (
        <PageLink
          text={next.text}
          href={next.href}
          disabled={next.disabled}
          icon={
            next.icon ? (
              next.icon
            ) : next.disabled ? (
              <BanIcon className="mr-2 size-4" />
            ) : (
              <ChevronRightIcon className="mr-2 size-4" />
            )
          }
        />
      ) : null}
    </div>
  );
}
