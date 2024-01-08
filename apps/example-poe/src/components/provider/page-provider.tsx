"use client";

import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { QAProvider } from "../context/qa-context";
import { PageStatus } from "@/lib/page-status";

type Props = {
	pageSlug: string;
	children: React.ReactNode;
	chunks: string[];
	pageStatus: PageStatus;
};

export const PageProvider = ({
	children,
	pageSlug,
	chunks,
	pageStatus,
}: Props) => {
	useTrackLastVisitedPage();

	return (
		<QAProvider pageSlug={pageSlug} chunks={chunks} pageStatus={pageStatus}>
			{children}
		</QAProvider>
	);
};
