"use client";

import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { PageStatus } from "@/lib/page-status";
import { SelectedQuestions } from "@/lib/question";
import { ChatState, ChatStore, createChatStore } from "@/lib/store/chat";
import {
	QuestionState,
	QuestionStore,
	createQuestionStore,
} from "@/lib/store/question";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

type Props = {
	children: React.ReactNode;
	pageSlug: string;
	pageTitle: string;
	chunks: string[];
	questions: SelectedQuestions;
	pageStatus: PageStatus;
};

const PageContext = createContext<{
	questionStore: QuestionStore;
	chatStore: ChatStore;
} | null>(null);

export const PageProvider = ({
	children,
	pageSlug,
	pageTitle,
	chunks,
	questions,
	pageStatus,
}: Props) => {
	useTrackLastVisitedPage();

	const questionStoreRef = useRef<QuestionStore>();
	if (!questionStoreRef.current) {
		questionStoreRef.current = createQuestionStore(
			pageSlug,
			chunks,
			questions,
			pageStatus,
		);
	}

	const chatStoreRef = useRef<ChatStore>();
	if (!chatStoreRef.current) {
		chatStoreRef.current = createChatStore({ pageTitle });
	}

	return (
		<PageContext.Provider
			value={{
				questionStore: questionStoreRef.current,
				chatStore: chatStoreRef.current,
			}}
		>
			{children}
		</PageContext.Provider>
	);
};

export function useQuestion<T>(selector: (state: QuestionState) => T): T {
	const value = useContext(PageContext);
	if (!value) return {} as T;
	return useStore(value.questionStore, selector);
}

export function useChat<T>(selector: (state: ChatState) => T): T {
	const value = useContext(PageContext);
	if (!value) return {} as T;
	return useStore(value.chatStore, selector);
}
