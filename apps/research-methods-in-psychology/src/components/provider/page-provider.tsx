"use client";

import { createChatsAction } from "@/actions/chat";
import { PageStatus } from "@/lib/page-status";
import {
	ChatStore,
	botMessage,
	createChatStore,
	getHistory,
	userMessage,
} from "@/lib/store/chat-store";
import { Page } from "#content";

import { apiClient } from "@/lib/api-client";
import {
	ChunkQuestion,
	QuestionSnapshot,
	QuestionStore,
	createQuestionStore,
} from "@/lib/store/question-store";
import { QuizStore, createQuizStore } from "@/lib/store/quiz-store";
import { SummaryStore, createSummaryStore } from "@/lib/store/summary-store";
import { reportSentry } from "@/lib/utils";
import { useLocalStorage } from "@itell/core/hooks";
import { parseEventStream } from "@itell/utils";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useServerAction } from "zsa-react";

type Props = {
	children: React.ReactNode;
	condition: string;
	page: Page;
	pageStatus: PageStatus;
};

type State = {
	condition: string;
	chunks: string[];
	questionStore: QuestionStore;
	chatStore: ChatStore;
	summaryStore: SummaryStore;
	quizStore: QuizStore;
};
const PageContext = createContext<State>({} as State);

export const PageProvider = ({
	children,
	condition,
	page,
	pageStatus,
}: Props) => {
	const slugs = page.chunks.map(({ slug }) => slug);
	const [snapshot, setSnapshot] = useLocalStorage<QuestionSnapshot | undefined>(
		`question-store-${page.slug}`,
		undefined,
	);

	const questions = useMemo(() => {
		if (page.cri.length === 0) {
			return {};
		}

		const chunkQuestion: ChunkQuestion = Object.fromEntries(
			page.chunks.map((chunk) => [chunk, false]),
		);
		if (page.chunks.length > 0) {
			let withQuestion = false;
			page.cri.forEach((item) => {
				if (Math.random() < 1 / 3) {
					chunkQuestion[item.slug] = true;
					if (!withQuestion) {
						withQuestion = true;
					}
				}
			});

			// Each page will have at least one question
			if (!withQuestion) {
				const randomQuestion =
					page.cri[Math.floor(Math.random() * page.cri.length)];

				chunkQuestion[randomQuestion.slug] = true;
			}
		}

		return chunkQuestion;
	}, [page]);

	const questionStoreRef = useRef<QuestionStore>();
	if (!questionStoreRef.current) {
		questionStoreRef.current = createQuestionStore(
			{
				chunks: page.chunks,
				pageStatus,
				chunkQuestion: questions,
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

	const quizStoreRef = useRef<QuizStore>();
	if (!quizStoreRef.current) {
		quizStoreRef.current = createQuizStore();
	}

	return (
		<PageContext.Provider
			value={{
				questionStore: questionStoreRef.current,
				chatStore: chatStoreRef.current,
				summaryStore: summaryStoreRef.current,
				quizStore: quizStoreRef.current,
				chunks: slugs,
				condition,
			}}
		>
			{children}
		</PageContext.Provider>
	);
};

export const useCondition = () => {
	const state = useContext(PageContext);
	return useMemo(() => state.condition, [state.condition]);
};

export const useChunks = () => {
	const state = useContext(PageContext);
	return useMemo(() => state.chunks, [state.chunks]);
};

export const useSummaryStore = () => {
	const value = useContext(PageContext);
	return value.summaryStore;
};

export const useChatStore = () => {
	const value = useContext(PageContext);
	return value.chatStore;
};

export const useQuestionStore = () => {
	const value = useContext(PageContext);
	return value.questionStore;
};

export const useQuizStore = () => {
	const value = useContext(PageContext);
	return value.quizStore;
};

export const useAddChat = () => {
	const store = useChatStore();
	const [pending, setPending] = useState(false);

	const { execute, isError, error } = useServerAction(createChatsAction);

	const action = async ({
		text,
		pageSlug,
		transform,
		currentChunk,
	}: {
		text: string;
		pageSlug: string;
		transform?: boolean;
		currentChunk?: string | null;
	}) => {
		setPending(true);
		const userTimestamp = Date.now();
		store.send({
			type: "addMessage",
			data: userMessage({ text, transform, isStairs: false }),
		});

		const botMessageId = crypto.randomUUID();
		store.send({
			type: "addMessage",
			data: botMessage({
				id: botMessageId,
				text: "",
				isStairs: false,
			}),
			setActive: true,
		});

		try {
			// init response message
			const response = await apiClient.api.chat.$post({
				json: {
					page_slug: pageSlug,
					message: text,
					history: getHistory(store),
					current_chunk: currentChunk,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch chat response");
			}
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
							transform,
						},
						{
							text: data.text,
							is_user: false,
							timestamp: botTimestamp,
							is_stairs: false,
							context: data.context?.at(0),
							transform,
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
