import { useLocalStorage } from "@itell/core/hooks";
import { useEffect, useState } from "react";
import { firstPage } from "../pages";
import { makePageHref } from "../utils";
import { usePageSlug } from "./utils";

const key = "last-visited-page";

export const useTrackLastVisitedPage = () => {
	const slug = usePageSlug();
	const [_, setLastPageUrl] = useLocalStorage<string | undefined>(
		key,
		undefined,
	);

	useEffect(() => {
		if (slug) {
			setLastPageUrl(makePageHref(slug));
		}
	}, [slug]);
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
