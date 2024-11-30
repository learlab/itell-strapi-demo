"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDebounce } from "@itell/core/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@itell/ui/popover";
import { cn } from "@itell/utils";
import { Page } from "#content";
import { PinIcon, TableOfContentsIcon } from "lucide-react";

import { PageStatus } from "@/lib/page-status";
import { NoteCount } from "./_components/note/note-count";
import { PageStatusInfo } from "./_components/page-status-info";
import { setCookie } from "@/lib/cookie";
import { PAGE_HEADER_PIN_COOKIE } from "@/lib/constants";

export function PageHeader({
  page,
  pageStatus,
  pin,
}: {
  page: Page;
  pageStatus: PageStatus;
  pin: boolean;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldAutoHide, setShouldAutoHide] = useState(pin);

  useEffect(() => {
    const controlNavbar = () => {
      if (!shouldAutoHide) return;
      if (window.scrollY > lastScrollY) {
        // if scroll down hide the navbar
        setIsVisible(false);
      } else {
        // if scroll up show the navbar
        setIsVisible(true);
      }

      // remember current page location to use in the next move
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY, shouldAutoHide]);

  return (
    <header
      id="page-header"
      className={cn(
        "sticky top-[calc(var(--nav-height))] z-40 col-span-full mb-4 flex items-center justify-between border-b-2 bg-background/95 px-4 py-3 backdrop-blur transition-all duration-300 ease-in-out supports-[backdrop-filter]:bg-background/60",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium tracking-tight text-balance">
          {page.title}
        </h2>
        <TableOfContents page={page} />
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-hidden="true"
          onClick={() => {
            setShouldAutoHide(!shouldAutoHide);
            setCookie(
              PAGE_HEADER_PIN_COOKIE,
              !shouldAutoHide ? "true" : "false"
            );
          }}
        >
          <PinIcon
            className={cn("transition-all size-4 rotate-45", {
              "rotate-0": !shouldAutoHide,
            })}
          />
        </button>

        <NoteCount />
        <PageStatusInfo status={pageStatus} />
      </div>
    </header>
  );
}

function TableOfContents({ page }: { page: Page }) {
  const [_activeHeading, setActiveHeading] = useState<string | null>(
    page.chunks[0].slug
  );
  const activeHeading = useDebounce(_activeHeading, 100);
  const activeHeadingTitle = page.chunks.find(
    (chunk) => chunk.slug === activeHeading
  )?.title;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const chunkSlug = el.dataset.chunkSlug;
            if (chunkSlug) {
              setActiveHeading(chunkSlug);
            }
          }
        });
      },
      { rootMargin: "-10% 0% -80% 0%" }
    );

    page.chunks.forEach((chunk) => {
      const el = document.querySelector(
        `section[data-chunk-slug='${chunk.slug}']`
      );
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="hidden lg:flex items-center gap-2">
      <Popover>
        <PopoverTrigger>
          <span className="sr-only">Table of Contents</span>
          <TableOfContentsIcon className="size-4" />
        </PopoverTrigger>
        <PopoverContent>
          <ul className="flex flex-col gap-2">
            {page.chunks.map((chunk) => (
              <li key={chunk.slug}>
                <Link
                  href={`#${chunk.slug}`}
                  className={cn(
                    "text-sm hover:underline",
                    chunk.slug === activeHeading
                      ? "font-semibold"
                      : "font-light"
                  )}
                >
                  {chunk.title}
                </Link>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
      <p
        className={cn(
          "font-light",
          _activeHeading !== page.chunks[0].slug && "fade-up"
        )}
        key={activeHeadingTitle}
      >
        {activeHeadingTitle}
      </p>
    </div>
  );
}
