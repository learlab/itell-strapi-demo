"use client";

import { createChatsAction } from "@/actions/chat";
import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { PageStatus } from "@/lib/page-status";
import { SelectedQuestions } from "@/lib/question";
import { ChatState, ChatStore, createChatStore } from "@/lib/store/chat-store";
import {
	QuestionState,
	QuestionStore,
	createQuestionStore,
} from "@/lib/store/question-store";
import { reportSentry } from "@/lib/utils";
import { parseEventStream } from "@itell/utils";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useServerAction } from "zsa-react";
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

export const useAddChat = () => {
	const {
		addUserMessage,
		addBotMessage,
		updateBotMessage,
		setActiveMessageId,
		getHistory,
	} = useChat((state) => ({
		addUserMessage: state.addUserMessage,
		addBotMessage: state.addBotMessage,
		updateBotMessage: state.updateBotMessage,
		setActiveMessageId: state.setActiveMessageId,
		getHistory: state.getHistory,
	}));
	const [pending, setPending] = useState(false);

	const { execute, isError, error } = useServerAction(createChatsAction);

	const action = async ({
		text,
		pageSlug,
	}: { text: string; pageSlug: string }) => {
		setPending(true);
		const userTimestamp = Date.now();
		addUserMessage(text, false);
		const botMessageId = addBotMessage("", false);
		setActiveMessageId(botMessageId);

		try {
			// init response message
			const response = await fetch("/api/itell/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					page_slug: pageSlug,
					message: text,
					history: getHistory({ isStairs: false }),
				}),
			});

			setActiveMessageId(null);

			let data = {} as { text: string; context?: string[] };

			if (response.ok && response.body) {
				await parseEventStream(response.body, (d, done) => {
					if (!done) {
						try {
							data = JSON.parse(d) as typeof data;
							updateBotMessage(botMessageId, data.text, false);
						} catch (err) {
							console.log("invalid json", data);
						}
					}
				});

				updateBotMessage(botMessageId, data.text, false, data.context?.at(0));

				const botTimestamp = Date.now();
				execute({
					pageSlug,
					messages: [
						{
							text,
							is_user: true,
							timestamp: userTimestamp,
							is_stairs: false,
						},
						{
							text: data.text,
							is_user: false,
							timestamp: botTimestamp,
							is_stairs: false,
							context: data.context?.at(0),
						},
					],
				});
			} else {
				console.log("invalid response", response);
				throw new Error("invalid response");
			}
		} catch (err) {
			reportSentry("eval chat", { error: err, input: text, pageSlug });
			updateBotMessage(
				botMessageId,
				"Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
				false,
			);
		}

		setPending(false);
	};

	useEffect(() => {
		if (isError) {
			reportSentry("create chat", { error });
		}
	}, [isError]);

	return { action, pending, isError, error };
};
