import { firstPage } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { useLocalStorage } from "@itell/core/hooks";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const key = "last-visited-page";

const nonTextbookPaths = ["/dashboard", "/api", "/auth", "/summary", "/guide"];

export const useTrackLastVisitedPage = () => {
	const pathname = usePathname();

	const [_, setLastPageUrl] = useLocalStorage<string | undefined>(
		key,
		undefined,
	);

	useEffect(() => {
		if (pathname) {
			const isPage =
				nonTextbookPaths.findIndex((path) => pathname.startsWith(path)) ===
					-1 && pathname !== "/";
			if (isPage) {
				const splitted = pathname.split("/");
				if (splitted.length === 2) {
					setLastPageUrl(makePageHref(splitted[1]));
				}
			}
		}
	}, [pathname]);
};

export const useLastVisitedPageUrl = () => {
	const [lastPage, _] = useLocalStorage<string | undefined>(key, undefined);
	const [url, setUrl] = useState<string>(firstPage.url);

	useEffect(() => {
		if (lastPage) {
			const url = lastPage;
			setUrl(url);
		}
	}, [lastPage]);

	return url;
};
