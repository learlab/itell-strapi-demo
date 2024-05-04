"use client";

import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { PageStatus } from "@/lib/page-status";
import {
	ConfigState,
	ConfigStore,
	FeedbackType,
	createConfigStore,
} from "@/lib/store/config";
import {
	ConstructedResponseState,
	ConstructedResponseStore,
	createConstructedResponseStore,
} from "@/lib/store/constructed-response";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

type Props = {
	feedbackType: FeedbackType;
	pageSlug: string;
	children: React.ReactNode;
	chunks: string[];
	pageStatus: PageStatus;
	isLastChunkWithQuestion: boolean;
	isAdmin?: boolean;
};

const PageContext = createContext<{
	constructedResponseStore: ConstructedResponseStore;
	configStore: ConfigStore;
} | null>(null);

export const PageProvider = ({
	children,
	feedbackType,
	pageSlug,
	chunks,
	pageStatus,
	isLastChunkWithQuestion,
	isAdmin = false,
}: Props) => {
	useTrackLastVisitedPage();

	const constructedResponseStoreRef = useRef<ConstructedResponseStore>();
	const configStoreRef = useRef<ConfigStore>();
	if (!constructedResponseStoreRef.current) {
		constructedResponseStoreRef.current = createConstructedResponseStore(
			pageSlug,
			chunks,
			pageStatus,
			isLastChunkWithQuestion,
		);
	}

	if (!configStoreRef.current) {
		configStoreRef.current = createConfigStore({
			feedbackType,
			isAdmin,
		});
	}

	return (
		<PageContext.Provider
			value={{
				constructedResponseStore: constructedResponseStoreRef.current,
				configStore: configStoreRef.current,
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

export function useConfig<T>(selector: (state: ConfigState) => T): T {
	const value = useContext(PageContext);
	if (!value) return {} as T;
	return useStore(value.configStore, selector);
}
