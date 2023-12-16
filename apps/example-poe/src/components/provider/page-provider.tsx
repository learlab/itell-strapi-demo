"use client";

import { QAProvider } from "../context/qa-context";

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
	return <QAProvider>{children}</QAProvider>;
};
