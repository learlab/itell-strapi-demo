"use client";

import { createChatMessage } from "@/lib/server-actions";
import { useChatStore } from "@/lib/store/chat";
import {
	BotMessage,
	UserMessage,
	fetchChatResponse,
} from "@itell/core/chatbot";
import { cn } from "@itell/core/utils";
import { CornerDownLeft } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import TextArea from "react-textarea-autosize";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
	pageSlug: string;
	isChunkQuestion: boolean;
}

export const ChatInput = ({
	className,
	pageSlug,
	isChunkQuestion,
	...props
}: ChatInputProps) => {
	const {
		addUserMessage,
		addBotMessage,
		updateBotMessage,
		setChunkQuestionAnswered,
		setActiveMessageId,
	} = useChatStore();
	const [pending, setPending] = useState(false);

	const onMessage = async (text: string) => {
		setPending(true);
		const userMessageId = addUserMessage(text, isChunkQuestion);

		if (isChunkQuestion) {
			setChunkQuestionAnswered(true);
		}

		// init response message
		const botMessageId = addBotMessage("", isChunkQuestion);
		setActiveMessageId(botMessageId);

		const chatResponse = await fetchChatResponse({
			endpoint: "https://itell-api.learlab.vanderbilt.edu/chat",
			pageSlug,
			text,
		});
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
					updateBotMessage(botMessageId, botText, isChunkQuestion);
				}
			}

			if (done && !isChunkQuestion) {
				const userMessage = {
					id: userMessageId,
					text,
					isUser: true,
				} as UserMessage;
				const botMessage = {
					id: botMessageId,
					text: botText,
					isUser: false,
				} as BotMessage;

				createChatMessage({ pageSlug, userMessage, botMessage });
			}
		} else {
			addBotMessage(
				"Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
				isChunkQuestion,
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
						<kbd className="inline-flex items-center rounded border px-1 text-xs">
							<CornerDownLeft className="w-3 h-3" />
						</kbd>
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
