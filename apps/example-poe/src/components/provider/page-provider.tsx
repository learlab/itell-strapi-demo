"use client";

import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { QAProvider } from "../context/qa-context";

type Props = {
	pageSlug: string;
	children: React.ReactNode;
};

export const PageProvider = ({ children, pageSlug }: Props) => {
	useTrackLastVisitedPage();

	return <QAProvider pageSlug={pageSlug}>{children}</QAProvider>;
};
