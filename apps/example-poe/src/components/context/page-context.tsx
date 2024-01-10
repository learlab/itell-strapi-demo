"use client";

import { PageStatus } from "@/lib/page-status";
import { createContext, useContext, useState } from "react";

type PageContextType = {
	pageSlug: string;
	pageStatus: PageStatus;
	isPageFinished: boolean;
	setIsPageFinished: React.Dispatch<React.SetStateAction<boolean>>;
};

const PageContext = createContext({} as PageContextType);

export const usePage = () => useContext(PageContext);

export const PageProvider = ({
	children,
	pageSlug,
	pageStatus,
}: { children: React.ReactNode; pageSlug: string; pageStatus: PageStatus }) => {
	const [isPageFinished, setIsPageFinished] = useState(
		pageStatus.isPageUnlocked,
	);

	return (
		<PageContext.Provider
			value={{ pageSlug, pageStatus, isPageFinished, setIsPageFinished }}
		>
			{children}
		</PageContext.Provider>
	);
};
