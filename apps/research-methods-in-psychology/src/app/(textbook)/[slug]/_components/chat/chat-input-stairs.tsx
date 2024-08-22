"use client";

import { createChatsAction } from "@/actions/chat";
import { InternalError } from "@/components/internal-error";
import { useChatStore } from "@/components/provider/page-provider";
import { isProduction } from "@/lib/constants";
import {
	SelectStairsAnswered,
	SelectStairsMessages,
	SelectStairsQuestion,
	SelectStairsReady,
	SelectStairsTimestamp,
	botMessage,
	userMessage,
} from "@/lib/store/chat-store";
import { reportSentry } from "@/lib/utils";
import { Elements } from "@itell/constants";
import type { ChatHistory } from "@itell/core/chat";
import { cn, parseEventStream } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { CornerDownLeft } from "lucide-react";
import { HTMLAttributes, useRef, useState } from "react";
import TextArea from "react-textarea-autosize";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
	pageSlug: string;
}

export const ChatInputStairs = ({ className, pageSlug }: ChatInputProps) => {
	const store = useChatStore();
	const messages = useSelector(store, SelectStairsMessages);
	const stairsQuestion = useSelector(store, SelectStairsQuestion);
	const stairsAnswered = useSelector(store, SelectStairsAnswered);
	const stairsTimestamp = useSelector(store, SelectStairsTimestamp);
	const stairsReady = useSelector(store, SelectStairsReady);
	const [pending, setPending] = useState(false);

	const { isError, execute } = useServerAction(createChatsAction);
	const overMessageLimit = messages.length > 6;
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

		// add the question to normal chat
		store.send({
			type: "addMessage",
			data: botMessage({
				text: stairsQuestion?.text || "",
				isStairs: false,
			}),
		});

		store.send({
			type: "addMessage",
			data: userMessage({
				text,
				isStairs: true,
			}),
		});

		store.send({
			type: "addMessage",
			data: userMessage({
				text,
				isStairs: false,
			}),
		});

		if (!stairsAnswered) {
			store.send({
				type: "setStairsAnswered",
				value: true,
			});
		}

		// init response message
		const botMessageId = crypto.randomUUID();
		store.send({
			type: "addMessage",
			data: botMessage({
				id: botMessageId,
				text: "",
				isStairs: true,
			}),
			setActive: true,
		});

		try {
			const response = await fetch("/api/itell/chat/stairs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					page_slug: pageSlug,
					message: text,
					history: history.current,
					current_chunk: stairsQuestion?.chunk,
				}),
			});
			store.send({
				type: "setActive",
				id: null,
			});

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
								isStairs: true,
							});
						} catch (err) {
							console.log("invalid json", data);
						}
					}
				});

				const context = data.context?.at(0);
				store.send({
					type: "updateMessage",
					id: botMessageId,
					isStairs: true,
					text: data.text,
					context,
				});

				const botTimestamp = Date.now();
				// also add the final bot message to the normal chat
				store.send({
					type: "addMessage",
					data: botMessage({
						text: data.text,
						isStairs: false,
						context,
					}),
				});
				history.current.push(
					{
						agent: "user",
						text,
					},
					{
						agent: "bot",
						text: data.text,
					},
				);

				if (history.current.length === 3) {
					const el = document.getElementById(Elements.STAIRS_RETURN_BUTTON);
					if (el) {
						el.focus();
					}
				}

				if (!answered.current) {
					execute({
						pageSlug,
						messages: [
							{
								text: String(stairsQuestion?.text),
								is_user: false,
								timestamp: Number(stairsTimestamp),
								is_stairs: true,
								stairs_data: {
									chunk: String(stairsQuestion?.chunk),
									question_type: String(stairsQuestion?.question_type),
								},
							},
							{
								text,
								is_user: true,
								timestamp: userTimestamp,
								is_stairs: true,
							},
							{
								text: data.text,
								is_user: false,
								timestamp: botTimestamp,
								is_stairs: true,
								context,
							},
						],
					});
				} else {
					answered.current = true;
					execute({
						pageSlug,
						messages: [
							{
								text,
								is_user: true,
								timestamp: userTimestamp,
								is_stairs: true,
							},
							{
								text: data.text,
								is_user: false,
								timestamp: botTimestamp,
								is_stairs: true,
								context,
							},
						],
					});
				}
			} else {
				console.log("invalid response", response);
				throw new Error("invalid response");
			}
		} catch (err) {
			reportSentry("eval chat stairs", {
				error: err,
				input: text,
				pageSlug,
			});
			store.send({
				type: "updateMessage",
				id: botMessageId,
				text: "Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
				isStairs: false,
			});
		}

		setPending(false);
	};

	return (
		<div className={cn("grid gap-2 px-2", className)}>
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
									: "Answer the question"
							}
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
					</div>
				) : null}
			</form>
			{isError && (
				<InternalError className="px-2">
					<p>Failed to save chat</p>
				</InternalError>
			)}
		</div>
	);
};
