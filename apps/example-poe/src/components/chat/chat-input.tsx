"use client";

import { Message, fetchChatResponse } from "@itell/core/chatbot";
import { cn, decodeStream } from "@itell/core/utils";
import { CornerDownLeft } from "lucide-react";
import { HTMLAttributes } from "react";
import TextArea from "react-textarea-autosize";
import { useChat } from "../context/chat-context";

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
		addMessage,
		updateMessage,
		setActiveMessageId,
		setChunkQuestionAnswered,
	} = useChat();

	const onMessage = async (text: string) => {
		// add user message
		addMessage({
			text,
			id: crypto.randomUUID(),
			isUser: true,
			isChunkQuestion,
		});

		if (isChunkQuestion) {
			setChunkQuestionAnswered(true);
		}

		const responseId = crypto.randomUUID();
		setActiveMessageId(responseId);

		// init response message
		addMessage({
			id: responseId,
			text: "",
			isUser: false,
			isChunkQuestion,
		});

		const chatResponse = await fetchChatResponse({
			endpoint: "https://itell-api.learlab.vanderbilt.edu/chat",
			pageSlug,
			text,
		});
		setActiveMessageId(undefined);

		if (chatResponse.ok) {
			const reader = chatResponse.data.getReader();
			const decoder = new TextDecoder();
			let done = false;
			let text = "";

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunk = decoder.decode(value);
				if (chunk) {
					const chunkValue = JSON.parse(chunk.trim().split("\u0000")[0]) as {
						request_id: string;
						text: string;
					};
					text = chunkValue.text;
					updateMessage(responseId, () => text);
				}
			}

			if (done && !isChunkQuestion) {
				updateMessage(responseId, () => text, true);
			}
		}
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
