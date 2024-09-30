"use client";

import { useEffect } from "react";

import { Elements } from "@itell/constants";
import { cn } from "@itell/utils";
import { type Page } from "#content";

type TocSidebarProps = {
  chunks: Page["chunks"];
};

export function PageToc({ chunks }: TocSidebarProps) {
  useEffect(() => {
    let mostRecentHeading: string | null = null;
    let isUsingMostRecentHeading = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.intersectionRatio > 0) {
          document
            .querySelector(`div.page-toc ol li a[href="#${id}"]`)
            ?.classList.add(Elements.PAGE_NAV_ACTIVE);
          if (isUsingMostRecentHeading) {
            document
              .querySelector(
                `div.page-toc ol li a[href="#${String(mostRecentHeading)}"]`
              )
              ?.classList.remove(Elements.PAGE_NAV_ACTIVE);
          }
          mostRecentHeading = id;
        } else {
          document
            .querySelector(`div.page-toc ol li a[href="#${id}"]`)
            ?.classList.remove(Elements.PAGE_NAV_ACTIVE);
        }
      });
      if (
        entries
          .map((entry) => entry.intersectionRatio)
          .reduce((partialSum, a) => partialSum + a, 0) === 0
      ) {
        isUsingMostRecentHeading = true;
        document
          .querySelector(
            `.page-toc ol li a[href="#${String(mostRecentHeading)}"]`
          )
          ?.classList.add(Elements.PAGE_NAV_ACTIVE);
      }
    });

    for (const heading of chunks) {
      const element = document.getElementById(heading.slug || "");
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [chunks]);

  return (
    <div className="page-toc space-y-4 px-1">
      <a className="sr-only" href={`#${Elements.TEXTBOOK_MAIN}`}>
        skip to main content
      </a>
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full ring-2 ring-blue-400" />
        <h3 className="font-semibold">On this page</h3>
      </div>
      <ol className="flex list-none flex-col gap-2 pr-2 text-muted-foreground">
        {chunks.map((chunk) => (
          <li
            key={chunk.slug}
            className={cn(
              "flex flex-col gap-1 py-0.5 transition-colors delay-150 ease-out"
            )}
          >
            <a
              data-heading-level={2}
              href={`#${chunk.slug}`}
              className="text-pretty text-sm hover:underline"
            >
              {chunk.title}
            </a>

            {chunk.headings && chunk.headings.length > 0 ? (
              <ol className="ml-2 flex flex-col gap-2 text-sm text-muted-foreground">
                {chunk.headings.map((heading) => (
                  <li key={heading.slug}>
                    <a
                      href={`#${heading.slug}`}
                      data-heading-level={heading.level}
                      className="text-pretty hover:underline hover:underline-offset-4"
                    >
                      {heading.title}
                    </a>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
