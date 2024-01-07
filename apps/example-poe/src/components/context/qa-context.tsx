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
	// new context state to keep track of whether a user clicked on the final Next Chunk button within a page
	const [finishedReading, setFinishedReading] = useState(false);

	const goToNextChunk = () => {
		const currentIndex = chunks.indexOf(currentChunk);
		if (currentIndex + 1 < chunks.length) {
			setCurrentChunk(chunks[currentIndex + 1]);
		} else if (currentIndex + 1 >= chunks.length) {
			// set finished reading to true if user clicked on the final Next Chunk button within the page
			setFinishedReading(true);
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
