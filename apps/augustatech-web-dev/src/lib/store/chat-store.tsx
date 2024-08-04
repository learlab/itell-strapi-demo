import { Message } from "@itell/core/chat";
import { SnapshotFromStore, createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

type StairsQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

export type ChatStore = ReturnType<typeof createChatStore>;
export const createChatStore = () => {
	return createStoreWithProducer(
		produce,
		{
			open: false as boolean,
			messages: [] as Message[],
			stairsMessages: [] as Message[],
			activeMessageId: null as string | null,
			stairsReady: false as boolean,
			stairsAnswered: false as boolean,
			stairsQuestion: null as StairsQuestion | null,
			stairsTimestamp: null as number | null,
		},
		{
			setOpen: (context, event: { value: boolean }) => {
				context.open = event.value;
			},
			setActive: (context, event: { id: string | null }) => {
				context.activeMessageId = event.id;
			},
			addMessage: (
				context,
				event: {
					id?: string;
					text: string;
					isStairs: boolean;
					isUser: boolean;
					active?: boolean;
				},
			) => {
				if (event.isStairs) {
					context.stairsMessages.push({
						id: event.id || crypto.randomUUID(),
						text: event.text,
						isUser: event.isUser,
					} as Message);
				} else {
					context.messages.push({
						id: event.id,
						text: event.text,
						isUser: event.isUser,
					} as Message);
				}

				if (event.active && event.id) {
					context.activeMessageId = event.id;
				}
			},
			updateMessage: (
				context,
				event: {
					id: string;
					text: string;
					isStairs: boolean;
					context?: string;
				},
			) => {
				const data = event.isStairs ? context.stairsMessages : context.messages;
				const message = data.find((m) => m.id === event.id);
				if (message && "text" in message) {
					message.text = event.text;
				}
				if (message && !message.isUser) {
					message.context = event.context;
				}
			},
			setStairsAnswered: (context, event: { value: boolean }) => {
				context.stairsAnswered = event.value;
			},

			setStairsReady: (context) => {
				context.stairsReady = true;
				context.stairsTimestamp = Date.now();
				context.stairsMessages.push({
					id: crypto.randomUUID(),
					isUser: false,
					text: context.stairsQuestion?.text || "",
				});
			},

			setStairsQuestion: (context, event: { data: StairsQuestion }) => {
				context.stairsQuestion = event.data;
				context.stairsReady = false;
			},
		},
	);
};

export const getHistory = (
	store: ChatStore,
	{ isStairs }: { isStairs: boolean },
) => {
	const snap = store.getSnapshot();
	const data = isStairs ? snap.context.stairsMessages : snap.context.messages;

	return data
		.filter((m) => "text" in m)
		.map((m) => ({
			agent: m.isUser ? "user" : "bot",
			text: m.text,
		}));
};

type Selector<T> = (state: SnapshotFromStore<ChatStore>) => T;

export const SelectStairsMessages: Selector<Message[]> = (state) =>
	state.context.stairsMessages;
export const SelectMessages: Selector<Message[]> = (state) =>
	state.context.messages;
export const SelectActiveMessageId: Selector<string | null> = (state) =>
	state.context.activeMessageId;
export const SelectStairsReady: Selector<boolean> = (state) =>
	state.context.stairsReady;
export const SelectStairsAnswered: Selector<boolean> = (state) =>
	state.context.stairsAnswered;
export const SelectStairsQuestion: Selector<StairsQuestion | null> = (state) =>
	state.context.stairsQuestion;
export const SelectStairsTimestamp: Selector<number | null> = (state) =>
	state.context.stairsTimestamp;
export const SelectOpen: Selector<boolean> = (state) => state.context.open;
