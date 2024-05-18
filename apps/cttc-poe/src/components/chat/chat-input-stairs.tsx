"use client";

import { env } from "@/env.mjs";
import { SessionUser } from "@/lib/auth";
import { createChatMessage } from "@/lib/chat/actions";
import { useChatStore } from "@/lib/store/chat";
import { ChatHistory, fetchChatResponse } from "@itell/core/chatbot";
import { cn } from "@itell/core/utils";
import { CornerDownLeft } from "lucide-react";
import { HTMLAttributes, useRef, useState } from "react";
import TextArea from "react-textarea-autosize";
import { Spinner } from "../spinner";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
	user: NonNullable<SessionUser>;
	pageSlug: string;
}

export const ChatInputStairs = ({
	user,
	className,
	pageSlug,
	...props
}: ChatInputProps) => {
	const {
		addUserMessage,
		addBotMessage,
		updateBotMessage,
		setStairsAnswered,
		stairsTimestamp,
		stairsAnswered,
		stairsReady,
		setActiveMessageId,
		stairsQuestion,
		stairsMessages,
	} = useChatStore();
	const [pending, setPending] = useState(false);
	const overMessageLimit = stairsMessages.length > 6;
	const answered = useRef(false);
	const history = useRef<ChatHistory>([
		{
			agent: "bot",
			text: String(stairsQuestion?.text),
		},
	]);

	const onMessage = async (text: string) => {
		setPending(true);
		const userTimestamp = Date.now();
		// add messages to both normal chat and stairs chat
		addBotMessage(String(stairsQuestion?.text), false);
		addUserMessage(text, true);
		addUserMessage(text, false);

		if (!stairsAnswered) {
			setStairsAnswered(true);
		}

		// init response message
		const botMessageId = addBotMessage("", true);
		setActiveMessageId(botMessageId);

		const chatResponse = await fetchChatResponse(
			`${env.NEXT_PUBLIC_API_URL}/chat`,
			{
				pageSlug,
				text,
				history: history.current,
			},
		);
		setActiveMessageId(null);

		if (chatResponse.ok) {
			const reader = chatResponse.data.getReader();
			const decoder = new TextDecoder();
			let done = false;
			let botText = "";

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunk = decoder.decode(value);
				if (chunk) {
					const chunkValue = JSON.parse(chunk.trim().split("\u0000")[0]) as {
						request_id: string;
						text: string;
					};
					botText = chunkValue.text;
					updateBotMessage(botMessageId, botText, true);
				}
			}

			if (done) {
				const botTimestamp = Date.now();
				// also add the final bot message to the normal chat
				addBotMessage(botText, false);
				history.current.push(
					{
						agent: "user",
						text,
					},
					{
						agent: "bot",
						text: botText,
					},
				);

				if (!answered.current) {
					createChatMessage({
						pageSlug,
						messages: [
							{
								text: String(stairsQuestion?.text),
								isUser: false,
								timestamp: Number(stairsTimestamp),
								isStairs: true,
								// ignoring for passing additional stairs data
								// @ts-ignore
								stairsData: {
									chunk: stairsQuestion?.chunk,
									question_type: stairsQuestion?.question_type,
								},
							},
							{
								text,
								isUser: true,
								timestamp: userTimestamp,
								isStairs: true,
							},
							{
								text: botText,
								isUser: false,
								timestamp: botTimestamp,
								isStairs: true,
							},
						],
					});
				} else {
					answered.current = true;
					createChatMessage({
						userId: user.id,
						pageSlug,
						messages: [
							{
								text,
								isUser: true,
								timestamp: userTimestamp,
								isStairs: true,
							},
							{
								text: botText,
								isUser: false,
								timestamp: botTimestamp,
								isStairs: true,
							},
						],
					});
				}
			}
		} else {
			updateBotMessage(
				botMessageId,
				"Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
				true,
			);
		}

		setPending(false);
	};

	return (
		<div {...props} className={cn("px-2", className)}>
			<form
				className="mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none"
				onSubmit={(e) => {
					e.preventDefault();
					if (!e.currentTarget.input.value) return;
					onMessage(e.currentTarget.input.value);
					e.currentTarget.input.value = "";
				}}
			>
				{overMessageLimit ? (
					<p className="p-2">Please return to the summary</p>
				) : stairsReady ? (
					<div className="relative">
						<TextArea
							name="input"
							rows={2}
							maxRows={4}
							autoFocus
							disabled={pending || overMessageLimit || !stairsReady}
							placeholder={
								overMessageLimit
									? "Please return to the summary"
									: "Message ITELL AI..."
							}
							className="disabled:opacity-50 bg-background/90 rounded-md border border-border pr-14 resize-none block w-full  px-4 py-1.5 focus:ring-0 text-sm sm:leading-6"
							onKeyDown={async (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									if (!e.currentTarget.value) return;
									onMessage(e.currentTarget.value);
									e.currentTarget.value = "";
								}
							}}
						/>

						<div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
							<button type="submit">
								{pending ? (
									<Spinner className="size-4" />
								) : (
									<kbd className="inline-flex items-center rounded border px-1 text-xs">
										<CornerDownLeft className="size-4" />
									</kbd>
								)}
							</button>
						</div>

						<div
							className="absolute inset-x-0 bottom-0 border-t border-border"
							aria-hidden="true"
						/>
					</div>
				) : (
					<p className="p-2">
						Click on the "ready for question" button to start
					</p>
				)}
			</form>
		</div>
	);
};
