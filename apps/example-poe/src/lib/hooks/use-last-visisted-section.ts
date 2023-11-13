import { useEffect, useState } from "react";
import { useLocation } from "./utils";
import { useLocalStorage } from "@itell/core/hooks";
import { makeLocationHref } from "../utils";
import { SectionLocationSchema } from "@/trpc/schema";

export const useTrackLastVisitedSection = () => {
	const location = useLocation();
	const [_, setLastVisitedSection] = useLocalStorage<string | undefined>(
		"last-visited-section",
		undefined,
	);

	useEffect(() => {
		if (location) {
			setLastVisitedSection(JSON.stringify(location));
		}
	}, [location]);
};

export const useLastVisitedSectionUrl = () => {
	const [lastVisitedSection, _] = useLocalStorage<string | undefined>(
		"last-visited-section",
		undefined,
	);
	const [url, setUrl] = useState<string>("/module-1/chapter-1");

	useEffect(() => {
		if (lastVisitedSection) {
			const parsedSection = JSON.parse(lastVisitedSection);
			const parsedSectionResult =
				SectionLocationSchema.safeParse(parsedSection);
			if (parsedSectionResult.success) {
				setUrl(makeLocationHref(parsedSectionResult.data));
			}
		}
	}, [lastVisitedSection]);

	return url;
};
