"use client";

import { createChatsAction } from "@/actions/chat";
import { InternalError } from "@/components/interval-error";
import { useChat } from "@/components/provider/page-provider";
import { isProduction } from "@/lib/constants";
import { getChatHistory } from "@/lib/store/chat";
import { reportSentry } from "@/lib/utils";
import { cn, parseEventStream } from "@itell/core/utils";
import { CornerDownLeft } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import TextArea from "react-textarea-autosize";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
	pageSlug: string;
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
	} = useChat((state) => ({
		addUserMessage: state.addUserMessage,
		addBotMessage: state.addBotMessage,
		updateBotMessage: state.updateBotMessage,
		setActiveMessageId: state.setActiveMessageId,
		messages: state.messages,
	}));
	const [pending, setPending] = useState(false);
	const { isError, execute } = useServerAction(createChatsAction);

	const onMessage = async (text: string) => {
		setPending(true);
		const userTimestamp = Date.now();
		addUserMessage(text, isStairs);

		// init response message
		const botMessageId = addBotMessage("", isStairs);
		setActiveMessageId(botMessageId);

		try {
			const chatResponse = await fetch("/api/itell/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					page_slug: pageSlug,
					message: text,
					history: getChatHistory(messages),
				}),
			});

			setActiveMessageId(null);

			let data = {} as { text: string; context?: string[] };

			if (chatResponse.ok && chatResponse.body) {
				await parseEventStream(chatResponse.body, (d, done) => {
					if (!done) {
						try {
							data = JSON.parse(d) as typeof data;
							updateBotMessage(botMessageId, data.text, isStairs);
						} catch (err) {
							console.log("invalid json", data);
						}
					}
				});

				updateBotMessage(
					botMessageId,
					data.text,
					isStairs,
					data.context?.at(0),
				);

				const botTimestamp = Date.now();
				execute({
					pageSlug,
					messages: [
						{
							text,
							isUser: true,
							timestamp: userTimestamp,
							isStairs,
						},
						{
							text: data.text,
							isUser: false,
							timestamp: botTimestamp,
							isStairs,
							context: data.context?.at(0),
						},
					],
				});
			} else {
				console.log("invalid response", chatResponse);
				throw new Error("invalid response");
			}
		} catch (err) {
			console.log("chat input error", err);
			reportSentry("eval chat", { error: err, input: text, pageSlug });
			updateBotMessage(
				botMessageId,
				"Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
				isStairs,
			);
		}

		setPending(false);
	};

	return (
		<div {...props} className={cn("px-2 grid gap-2", className)}>
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
					className="disabled:opacity-50 disabled:pointer-events-none bg-background/90 rounded-md border border-border pr-14 resize-none block w-full  px-4 py-1.5 focus:ring-0 text-sm sm:leading-6"
					onKeyDown={async (e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							if (!e.currentTarget.value) return;
							onMessage(e.currentTarget.value);
							e.currentTarget.value = "";
						}
					}}
					onPaste={(e) => {
						if (isProduction) {
							e.preventDefault();
							toast.warning("Copy & Paste is not allowed");
						}
					}}
				/>

				<div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
					<button type="submit" disabled={pending}>
						<kbd className="inline-flex items-center rounded border px-1 text-xs">
							<CornerDownLeft className="size-4" />
						</kbd>
					</button>
				</div>

				<div
					className="absolute inset-x-0 bottom-0 border-t border-border"
					aria-hidden="true"
				/>
			</form>
			{isError && (
				<InternalError className="px-2">Failed to save chat</InternalError>
			)}
		</div>
	);
};
