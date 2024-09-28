import { useEffect, useState } from "react";

import { makePageHref } from "@/lib/utils";
import { useLocalStorage } from "@itell/core/hooks";
import { usePathname } from "next/navigation";

const key = "last-visited-page";

const nonTextbookPaths = ["/dashboard", "/api", "/auth", "/summary", "/guide"];

export const useLastVisitedPage = () => {
  const pathname = usePathname();
  const [lastPageUrl, setLastPageUrl] = useLocalStorage<string | undefined>(
    key,
    undefined
  );

  useEffect(() => {
    if (pathname) {
      const isTextbookPage =
        nonTextbookPaths.every((path) => !pathname.startsWith(path)) &&
        pathname !== "/";

      if (isTextbookPage) {
        const pathSegments = pathname.split("/");
        if (pathSegments.length === 2) {
          const newPageUrl = makePageHref(pathSegments[1]);
          setLastPageUrl(newPageUrl);
        }
      }
    }
  }, [pathname]);

  return lastPageUrl;
};
