"use client";

import { env } from "@/env.mjs";
import { createChatMessage } from "@/lib/chat/actions";
import { getChatHistory, useChatStore } from "@/lib/store/chat";
import { fetchChatResponse } from "@itell/core/chatbot";
import { cn } from "@itell/core/utils";
import { CornerDownLeft } from "lucide-react";
import { type HTMLAttributes, useState } from "react";
import TextArea from "react-textarea-autosize";
import { Spinner } from "../spinner";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
	pageSlug: string;
	isStairs: boolean;
}

const isStairs = false;

export const ChatInput = ({
	className,
	pageSlug,
	...props
}: ChatInputProps) => {
	const {
		addUserMessage,
		addBotMessage,
		updateBotMessage,
		setActiveMessageId,
		messages,
	} = useChatStore();
	const [pending, setPending] = useState(false);

	const onMessage = async (text: string) => {
		setPending(true);
		const userTimestamp = Date.now();
		addUserMessage(text, isStairs);

		// init response message
		const botMessageId = addBotMessage("", isStairs);
		setActiveMessageId(botMessageId);

		// const chatResponse = await fetchChatResponse(
		// 	`${env.NEXT_PUBLIC_API_URL}/chat`,
		// 	{
		// 		pageSlug,
		// 		text,
		// 		history: getChatHistory(messages),
		// 	},
		// );
		const chatResponse = await fetch("/api/itell/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				pageSlug,
				text,
				history: getChatHistory(messages),
			}),
		});

		setActiveMessageId(null);

		if (chatResponse.ok && chatResponse.body) {
			const reader = chatResponse.body.getReader();
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
					updateBotMessage(botMessageId, botText, isStairs);
				}
			}

			if (done) {
				const botTimestamp = Date.now();
				createChatMessage({
					pageSlug,
					messages: [
						{
							text,
							isUser: true,
							timestamp: userTimestamp,
							isStairs,
						},
						{
							text: botText,
							isUser: false,
							timestamp: botTimestamp,
							isStairs,
						},
					],
				});
			}
		} else {
			updateBotMessage(
				botMessageId,
				"Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
				isStairs,
			);
		}

		setPending(false);
	};

	return (
		<div {...props} className={cn("px-2", className)}>
			<form
				className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none"
				onSubmit={(e) => {
					e.preventDefault();
					if (!e.currentTarget.input.value) return;
					onMessage(e.currentTarget.input.value);
					e.currentTarget.input.value = "";
				}}
			>
				<TextArea
					name="input"
					rows={2}
					maxRows={4}
					autoFocus
					disabled={pending}
					placeholder="Message ITELL AI..."
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
			</form>
		</div>
	);
};
