"use client";

import { createChatsAction } from "@/actions/chat";
import { useTrackLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { PageStatus } from "@/lib/page-status";
import { SelectedQuestions } from "@/lib/question";
import { ChatStore, createChatStore, getHistory } from "@/lib/store/chat-store";

import {
	QuestionSnapshot,
	QuestionStore,
	createQuestionStore,
} from "@/lib/store/question-store";
import { SummaryStore, createSummaryStore } from "@/lib/store/summary-store";
import { reportSentry } from "@/lib/utils";
import { useLocalStorage } from "@itell/core/hooks";
import { parseEventStream } from "@itell/utils";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useServerAction } from "zsa-react";

type Props = {
	children: React.ReactNode;
	pageSlug: string;
	chunks: string[];
	questions: SelectedQuestions;
	pageStatus: PageStatus;
};

const PageContext = createContext<{
	questionStore: QuestionStore;
	chatStore: ChatStore;
	summaryStore: SummaryStore;
} | null>(null);

export const PageProvider = ({
	children,
	pageSlug,
	chunks,
	questions,
	pageStatus,
}: Props) => {
	useTrackLastVisitedPage();

	const [snapshot, setSnapshot] = useLocalStorage<QuestionSnapshot | undefined>(
		`question-store-${pageSlug}`,
		undefined,
	);
	const questionStoreRef = useRef<QuestionStore>();
	if (!questionStoreRef.current) {
		questionStoreRef.current = createQuestionStore(
			{
				chunks,
				pageStatus,
				selectedQuestions: questions,
			},
			snapshot,
		);

		questionStoreRef.current.subscribe((state) => {
			setSnapshot(state.context);
		});
	}

	const chatStoreRef = useRef<ChatStore>();
	if (!chatStoreRef.current) {
		chatStoreRef.current = createChatStore();
	}

	const summaryStoreRef = useRef<SummaryStore>();
	if (!summaryStoreRef.current) {
		summaryStoreRef.current = createSummaryStore({ pageStatus });
	}

	return (
		<PageContext.Provider
			value={{
				questionStore: questionStoreRef.current,
				chatStore: chatStoreRef.current,
				summaryStore: summaryStoreRef.current,
			}}
		>
			{children}
		</PageContext.Provider>
	);
};

export const useSummaryStore = () => {
	const value = useContext(PageContext);
	if (!value) return {} as SummaryStore;
	return value.summaryStore;
};

export const useChatStore = () => {
	const value = useContext(PageContext);
	if (!value) return {} as ChatStore;
	return value.chatStore;
};

export const useQuestionStore = () => {
	const value = useContext(PageContext);
	if (!value) return {} as QuestionStore;
	return value.questionStore;
};

export const useAddChat = () => {
	const store = useChatStore();
	const [pending, setPending] = useState(false);

	const { execute, isError, error } = useServerAction(createChatsAction);

	const action = async ({
		text,
		pageSlug,
	}: { text: string; pageSlug: string }) => {
		setPending(true);
		const userTimestamp = Date.now();
		store.send({
			type: "addMessage",
			text,
			isUser: true,
			isStairs: false,
		});

		const botMessageId = crypto.randomUUID();
		store.send({
			type: "addMessage",
			id: botMessageId,
			text: "",
			isUser: false,
			isStairs: false,
			active: true,
		});

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
					history: getHistory(store, { isStairs: false }),
				}),
			});

			store.send({ type: "setActive", id: null });

			let data = {} as { text: string; context?: string[] };

			if (response.ok && response.body) {
				await parseEventStream(response.body, (d, done) => {
					if (!done) {
						try {
							data = JSON.parse(d) as typeof data;
							store.send({
								type: "updateMessage",
								id: botMessageId,
								text: data.text,
								isStairs: false,
							});
						} catch (err) {
							console.log("invalid json", data);
						}
					}
				});

				store.send({
					type: "updateMessage",
					id: botMessageId,
					isStairs: false,
					text: data.text,
					context: data.context?.at(0),
				});

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
			store.send({
				type: "updateMessage",
				id: botMessageId,
				text: "Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
				isStairs: false,
			});
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
