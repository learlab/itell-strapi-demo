"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@itell/utils";

import { isProduction } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { makePageHref } from "@/lib/utils";
import type { TocPageItem } from "@/lib/pages/pages.server";

type TocItemProps = {
  item: TocPageItem & { status: PageStatus };
  inGroup: boolean;
  activePage: string;
  onClick: (slug: string) => void;
  className?: string;
};

export function TocItem({
  item,
  inGroup,
  activePage,
  className,
  onClick,
}: TocItemProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { visible, label, icon } = getPageState({
    status: item.status,
    title: item.title,
  });
  const disabled = isProduction && (pending || !visible);
  return (
    <li
      className={cn(
        "relative border-l-2 transition duration-200 ease-in-out hover:bg-accent",
        {
          "bg-accent": item.slug === activePage,
          "text-muted-foreground": !visible,
          "pl-2": inGroup,
        },
        className
      )}
    >
      <Link
        href={makePageHref(item.slug)}
        onClick={(event) => {
          event.preventDefault();
          onClick(item.slug);
          startTransition(async () => {
            router.push(makePageHref(item.slug));
          });
        }}
        className={cn(
          "inline-flex w-full items-start justify-between text-balance p-2 text-left text-base lg:text-lg xl:gap-4 2xl:text-xl",
          {
            "animate-pulse": pending,
            "text-base 2xl:text-lg": inGroup,
            "cursor-not-allowed": disabled,
          }
        )}
        aria-label={label}
        aria-disabled={disabled}
      >
        <span className="flex-1">{item.title}</span>
        <span className="hidden lg:inline">{icon}</span>
      </Link>
    </li>
  );
}

const getPageState = ({
  status,
  title,
}: {
  status: PageStatus;
  title: string;
}) => {
  const visible = status.latest || status.unlocked;
  const label = `${title} - ${
    status.unlocked ? "Unlocked" : visible ? "Visible" : "Locked"
  }`;
  const icon = status.unlocked ? "✅" : status.latest ? "" : "🔒";
  return { label, icon, visible };
};
