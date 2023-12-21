"use client";

import { useCurrentChunk } from "@/lib/hooks/utils";
import React, { useState } from "react";

type QAContextType = {
	chunks: HTMLDivElement[] | undefined;
	setChunks: React.Dispatch<React.SetStateAction<HTMLDivElement[] | undefined>>;
	currentChunk: number;
	setCurrentChunk: React.Dispatch<React.SetStateAction<number>>;
};

const QAContext = React.createContext<QAContextType>({} as QAContextType);
export const useQA = () => React.useContext(QAContext);

type Props = {
	pageSlug: string;
	children: React.ReactNode;
};

export const QAProvider = ({ children, pageSlug }: Props) => {
	const [chunks, setChunks] = useState<HTMLDivElement[]>();
	const [currentChunk, setCurrentChunk] = useCurrentChunk(pageSlug);

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
