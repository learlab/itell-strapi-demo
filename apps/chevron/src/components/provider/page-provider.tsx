"use client";

import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { PageStatus } from "@/lib/page-status";
import {
	ConstructedResponseState,
	ConstructedResponseStore,
	createConstructedResponseStore,
} from "@/lib/store/constructed-response";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

type Props = {
	children: React.ReactNode;
	pageSlug: string;
	chunks: string[];
	pageStatus: PageStatus;
	isLastChunkWithQuestion: boolean;
};

const PageContext = createContext<{
	constructedResponseStore: ConstructedResponseStore;
} | null>(null);

export const PageProvider = ({
	children,
	pageSlug,
	chunks,
	pageStatus,
	isLastChunkWithQuestion,
}: Props) => {
	useTrackLastVisitedPage();

	const constructedResponseStoreRef = useRef<ConstructedResponseStore>();
	if (!constructedResponseStoreRef.current) {
		constructedResponseStoreRef.current = createConstructedResponseStore(
			pageSlug,
			chunks,
			pageStatus,
			isLastChunkWithQuestion,
		);
	}

	return (
		<PageContext.Provider
			value={{
				constructedResponseStore: constructedResponseStoreRef.current,
			}}
		>
			{children}
		</PageContext.Provider>
	);
};

export function useConstructedResponse<T>(
	selector: (state: ConstructedResponseState) => T,
): T {
	const value = useContext(PageContext);
	if (!value) return {} as T;
	return useStore(value.constructedResponseStore, selector);
}
