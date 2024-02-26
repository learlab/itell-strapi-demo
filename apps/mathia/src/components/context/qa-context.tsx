"use client";

import { useCurrentChunk, useIsPageFinished } from "@/lib/hooks/utils";
import { PageStatus } from "@/lib/page-status";
import React, { useEffect, useState } from "react";

type QAContextType = {
	currentChunk: string;
	goToNextChunk: () => void;
	chunks: string[];
	isPageFinished: boolean;
	setIsPageFinished: React.Dispatch<React.SetStateAction<boolean>>;
	isLastChunkWithQuestion: boolean;
	pageStatus: PageStatus;
};

const QAContext = React.createContext<QAContextType>({} as QAContextType);
export const useQA = () => React.useContext(QAContext);

type Props = {
	pageSlug: string;
	children: React.ReactNode;
	chunks: string[];
	pageStatus: PageStatus;
	isLastChunkWithQuestion: boolean;
};

export const QAProvider = ({
	children,
	pageSlug,
	chunks,
	pageStatus,
	isLastChunkWithQuestion,
}: Props) => {
	const [currentChunk, setCurrentChunk] = useCurrentChunk(pageSlug, chunks[0]);

	const [isPageFinished, setIsPageFinished] = useIsPageFinished(
		pageSlug,
		pageStatus.isPageUnlocked,
	);

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
				isPageFinished,
				chunks,
				setIsPageFinished,
				isLastChunkWithQuestion,
				pageStatus,
			}}
		>
			{children}
		</QAContext.Provider>
	);
};
