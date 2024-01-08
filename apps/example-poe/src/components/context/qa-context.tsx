"use client";

import { useCurrentChunk } from "@/lib/hooks/utils";
import { PageStatus } from "@/lib/page-status";
import React, { useEffect, useState } from "react";

type QAContextType = {
	currentChunk: string;
	goToNextChunk: () => void;
	isPageFinished: boolean;
	chunks: string[];
};

const QAContext = React.createContext<QAContextType>({} as QAContextType);
export const useQA = () => React.useContext(QAContext);

type Props = {
	pageSlug: string;
	children: React.ReactNode;
	chunks: string[];
	pageStatus: PageStatus;
};

export const QAProvider = ({
	children,
	pageSlug,
	chunks,
	pageStatus,
}: Props) => {
	const [currentChunk, setCurrentChunk] = useCurrentChunk(pageSlug, chunks[0]);
	const [isPageFinished, setIsPageFinished] = useState(
		pageStatus.isPageUnlocked,
	);

	useEffect(() => {
		if (!isPageFinished) {
			if (currentChunk === chunks[chunks.length - 1]) {
				setIsPageFinished(true);
			}
		}
	}, [currentChunk]);

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
			}}
		>
			{children}
		</QAContext.Provider>
	);
};
