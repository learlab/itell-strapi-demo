import React, { useCallback, useEffect, useState } from "react";

type QAContextType = {
	chunks: HTMLDivElement[] | undefined;
	currentChunk: number;
	goToNextChunk: () => void;
};

const QAContext = React.createContext<QAContextType>({} as QAContextType);
export const useQA = () => React.useContext(QAContext);

export const QAProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentChunk, setCurrentChunk] = useState(0);
	const [chunks, setChunks] = useState<HTMLDivElement[]>();

	const goToNextChunk = useCallback(() => {
		setCurrentChunk((val) => val + 1);
	}, []);

	useEffect(() => {
		const els = document.querySelectorAll(".content-chunk");
		if (els.length > 0) {
			setChunks(Array.from(els) as HTMLDivElement[]);
		}
	}, []);

	return (
		<QAContext.Provider
			value={{
				chunks,
				currentChunk,
				goToNextChunk,
			}}
		>
			{children}
		</QAContext.Provider>
	);
};
