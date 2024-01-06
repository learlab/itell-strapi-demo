"use client";

import { useCurrentChunk } from "@/lib/hooks/utils";
import React from "react";

type QAContextType = {
	currentChunk: string;
	goToNextChunk: () => void;
	chunks: string[];
};

const QAContext = React.createContext<QAContextType>({} as QAContextType);
export const useQA = () => React.useContext(QAContext);

type Props = {
	pageSlug: string;
	children: React.ReactNode;
	chunks: string[];
};

export const QAProvider = ({ children, pageSlug, chunks }: Props) => {
	const [currentChunk, setCurrentChunk] = useCurrentChunk(pageSlug, chunks[0]);

	const goToNextChunk = () => {
		const currentIndex = chunks.indexOf(currentChunk);
		if (currentIndex + 1 < chunks.length) {
			setCurrentChunk(chunks[currentIndex + 1]);
		}
	};

	return (
		<QAContext.Provider
			value={{
				currentChunk,
				goToNextChunk,
				chunks,
			}}
		>
			{children}
		</QAContext.Provider>
	);
};
