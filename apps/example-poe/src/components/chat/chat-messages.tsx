"use client";

import { cn } from "@itell/core/utils";
import { useChat } from "../context/chat-context";

export const ChatMessages = () => {
	const { messages } = useChat();
	const inverseMessages = messages.slice().reverse();

	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-3 px-2 py-3 flex-1 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
			)}
		>
			<div className="flex-1 flex-grow" />
			{inverseMessages.map((message) => {
				return (
					<div className="chat-message" key={`${message.id}-${message.id}`}>
						<div
							className={cn("flex items-end", {
								"justify-end": message.isUserMessage,
							})}
						>
							<div
								className={cn(
									"flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden",
									{
										"order-1 items-end": message.isUserMessage,
										"order-2 items-start": !message.isUserMessage,
									},
								)}
							>
								<p
									className={cn("px-4 py-2 rounded-lg", {
										"bg-blue-600 text-white": message.isUserMessage,
										"bg-gray-200 text-gray-900": !message.isUserMessage,
									})}
								>
									{message.text}
								</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
