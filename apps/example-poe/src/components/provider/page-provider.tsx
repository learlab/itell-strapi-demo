"use client";

import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { QAProvider } from "../context/qa-context";

type Props = {
	pageSlug: string;
	children: React.ReactNode;
	chunks: string[];
};

export const PageProvider = ({ children, pageSlug, chunks }: Props) => {
	useTrackLastVisitedPage();

	return (
		<QAProvider pageSlug={pageSlug} chunks={chunks}>
			{children}
		</QAProvider>
	);
};
