"use client";

import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { PageStatus } from "@/lib/page-status";
import { SelectedQuestions } from "@/lib/question";
import { ChatState, ChatStore, createChatStore } from "@/lib/store/chat";
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
	pageTitle: string;
	chunks: string[];
	currentChunk: string | undefined;
	questions: SelectedQuestions;
	pageStatus: PageStatus;
};

const PageContext = createContext<{
	constructedResponseStore: ConstructedResponseStore;
	chatStore: ChatStore;
} | null>(null);

export const PageProvider = ({
	children,
	pageSlug,
	pageTitle,
	chunks,
	questions,
	pageStatus,
	currentChunk,
}: Props) => {
	useTrackLastVisitedPage();

	const constructedResponseStoreRef = useRef<ConstructedResponseStore>();
	if (!constructedResponseStoreRef.current) {
		constructedResponseStoreRef.current = createConstructedResponseStore(
			pageSlug,
			chunks,
			questions,
			pageStatus,
			currentChunk,
		);
	}

	const chatStoreRef = useRef<ChatStore>();
	if (!chatStoreRef.current) {
		chatStoreRef.current = createChatStore({ pageTitle });
	}

	return (
		<PageContext.Provider
			value={{
				constructedResponseStore: constructedResponseStoreRef.current,
				chatStore: chatStoreRef.current,
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

export function useChat<T>(selector: (state: ChatState) => T): T {
	const value = useContext(PageContext);
	if (!value) return {} as T;
	return useStore(value.chatStore, selector);
}
