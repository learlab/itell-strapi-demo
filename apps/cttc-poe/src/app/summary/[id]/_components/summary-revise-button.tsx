"use client";

import { NavigationButton } from "@/components/navigation-button";
import { makePageHref } from "@/lib/utils";
import { Elements } from "@itell/constants";

export const SummaryReviseButton = ({
	pageSlug,
	text,
}: { pageSlug: string; text: string }) => {
	const buf = Buffer.from(text);

	return (
		<NavigationButton
			size={"default"}
			href={`${makePageHref(pageSlug)}#${
				Elements.PAGE_ASSIGNMENTS
			}?summary=${buf.toString("base64")}`}
		>
			Revise this summary
		</NavigationButton>
	);
};
