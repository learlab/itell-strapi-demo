import { useEffect, useState } from "react";
import { useLocalStorage } from "@itell/core/hooks";
import { firstPageUrl } from "../constants";
import { usePageSlug } from "./utils";
import { makePageHref } from "../utils";

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
	const [url, setUrl] = useState<string>(firstPageUrl);

	useEffect(() => {
		if (lastPage) {
			const url = lastPage;
			setUrl(url);
		}
	}, [lastPage]);

	return url;
};
