"use client";

import { QAProvider } from "../context/qa-context";

type Props = {
	pageSlug: string;
	children: React.ReactNode;
};

export const PageProvider = ({ children, pageSlug }: Props) => {
	return <QAProvider pageSlug={pageSlug}>{children}</QAProvider>;
};
