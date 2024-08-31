import { getChatMessages } from "@/lib/chat";
import { Condition } from "@/lib/control/condition";
import { Message } from "@itell/core/chat";
import { Avatar, AvatarImage } from "@itell/ui/avatar";
import { User } from "lucia";
import { Spinner } from "../spinner";
import { Chat } from "./chat";

type Props = {
	pageSlug: string;
	user: User | null;
};

export const ChatLoader = async ({ pageSlug, user }: Props) => {
	if (!user || user.condition !== Condition.STAIRS) return null;

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
	<div className="flex items-center gap-2 fixed right-8 bottom-12 w-80 lg:w-96  rounded-lg shadow-lg bg-background border border-border z-30 p-4">
		<Avatar className="rounded-none w-8 h-8">
			<AvatarImage src="/images/itell-ai.svg" />
		</Avatar>
		<span>ITELL AI</span>
		<Spinner />
	</div>
);
