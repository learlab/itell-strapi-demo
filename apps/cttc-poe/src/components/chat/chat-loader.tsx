import { getSession, getSessionUser } from "@/lib/auth";
import { getChatMessages } from "@/lib/chat";
import { Message } from "@itell/core/chatbot";
import { Avatar, AvatarImage } from "../client-components";
import { Spinner } from "../spinner";
import { Chat } from "./chat";

type Props = {
	pageSlug: string;
};

export const ChatLoader = async ({ pageSlug }: Props) => {
	const { user } = await getSession();
	if (!user) {
		return null;
	}

	const { data, updatedAt } = await getChatMessages(user.id, pageSlug);

	const messages = data.map((d) => ({
		...d,
		id: crypto.randomUUID(),
	})) as Message[];

	return (
		<>
			<Chat
				pageSlug={pageSlug}
				userId={user.id}
				userName={user.name}
				userImage={user.image}
				data={messages}
				updatedAt={updatedAt}
			/>
		</>
	);
};

ChatLoader.Skeleton = () => (
	<div className="flex items-center gap-2 fixed right-8 bottom-12 w-48 lg:w-64 rounded-lg shadow-lg bg-background border border-border z-30 p-4">
		<Avatar className="rounded-none w-8 h-8">
			<AvatarImage src="/images/itell-ai.svg" />
		</Avatar>
		<span>ITELL AI</span>
		<Spinner />
	</div>
);
