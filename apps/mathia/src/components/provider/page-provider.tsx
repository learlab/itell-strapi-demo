"use client";

import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { QAProvider } from "../context/qa-context";
import { PageStatus } from "@/lib/page-status";

type Props = {
	pageSlug: string;
	children: React.ReactNode;
	chunks: string[];
	pageStatus: PageStatus;
	isLastChunkWithQuestion: boolean;
};

export const PageProvider = ({
	children,
	pageSlug,
	chunks,
	pageStatus,
	isLastChunkWithQuestion,
}: Props) => {
	useTrackLastVisitedPage();

	return (
		<QAProvider
			pageSlug={pageSlug}
			chunks={chunks}
			pageStatus={pageStatus}
			isLastChunkWithQuestion={isLastChunkWithQuestion}
		>
			{children}
		</QAProvider>
	);
};
