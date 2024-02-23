import { getCurrentUser } from "@/lib/auth";
import { getChatMessages } from "@/lib/server-actions";
import { Message } from "@itell/core/chatbot";
import { Avatar, AvatarImage } from "../client-components";
import { Spinner } from "../spinner";
import { Chatbot } from "./chatbot";

type Props = {
	pageSlug: string;
};

export const ChatbotLoader = async ({ pageSlug }: Props) => {
	const user = await getCurrentUser();
	if (!user) {
		return null;
	}

	const { data, updatedAt } = await getChatMessages(pageSlug);

	return (
		<>
			<Chatbot
				pageSlug={pageSlug}
				user={user}
				data={data as Message[]}
				updatedAt={updatedAt}
			/>
		</>
	);
};

ChatbotLoader.Skeleton = () => (
	<div className="flex items-center gap-2 fixed right-8 bottom-12 w-48 lg:w-64 rounded-lg shadow-lg bg-background border border-border z-30 p-4">
		<Avatar className="rounded-none w-8 h-8">
			<AvatarImage src="/images/itell-ai.svg" />
		</Avatar>
		<span>ITELL AI</span>
		<Spinner />
	</div>
);
