"use client";

import { getCurrentChunkLocal, useCurrentChunkLocal } from "@/lib/hooks/utils";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type QAContextType = {
	chunks: HTMLDivElement[] | undefined;
	setChunks: React.Dispatch<React.SetStateAction<HTMLDivElement[] | undefined>>;
	currentChunk: number;
	setCurrentChunk: (index: number) => void;
};

const QAContext = React.createContext<QAContextType>({} as QAContextType);
export const useQA = () => React.useContext(QAContext);

export const QAProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentChunk, setCurrentChunk] = useState(0);
	const [chunks, setChunks] = useState<HTMLDivElement[]>();
	const pathname = usePathname();

	useEffect(() => {
		if (pathname) {
			const pageSlug = pathname.split("/")[1];
			const currentChunkLocal = getCurrentChunkLocal(pageSlug);
			setCurrentChunk(currentChunkLocal);
		}
	}, [pathname]);

	return (
		<QAContext.Provider
			value={{
				chunks,
				setChunks,
				currentChunk,
				setCurrentChunk,
			}}
		>
			{children}
		</QAContext.Provider>
	);
};
