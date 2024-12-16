"use client";

import { startTransition, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Elements } from "@itell/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@itell/ui/accordion";
import { cn } from "@itell/utils";
import { type Page } from "#content";

import { isProduction } from "@/lib/constants";
import { PageStatus } from "@/lib/page-status";
import { TocPageItem } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import { type TocPagesWithStatus } from ".";

type Props = {
  page: Page;
  pages: TocPagesWithStatus;
};

export function TextbookTocList({ page, pages }: Props) {
  const [activePage, setActivePage] = useOptimistic(page.slug);
  return (
    <nav aria-label="textbook primary">
      <a className="sr-only" href={`#${Elements.TEXTBOOK_MAIN}`}>
        skip to main content
      </a>
      <ol
        aria-label="list of chapters"
        className="leading-relaxed tracking-tight"
      >
        {pages.map((item) => {
          if (!item.group) {
            return (
              <TocItem
                key={item.slug}
                inGroup={false}
                onClick={(slug) => {
                  startTransition(() => {
                    setActivePage(slug);
                  });
                }}
                activePage={activePage}
                item={item}
              />
            );
          }

          return (
            <li key={item.title}>
              <Accordion
                type="single"
                collapsible
                defaultValue={page.parent?.slug}
                className="pb-0"
              >
                <AccordionItem value={item.slug} className="border-none">
                  <AccordionTrigger className="px-2 py-4 text-left text-base hover:bg-accent hover:no-underline lg:text-lg 2xl:text-xl">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <ul>
                      {item.pages.map((p) => (
                        <TocItem
                          key={p.slug}
                          onClick={() => {
                            startTransition(() => {
                              setActivePage(p.slug);
                            });
                          }}
                          item={p}
                          inGroup
                          activePage={activePage}
                        />
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

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
