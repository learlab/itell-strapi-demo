import { getChatsAction } from "@/actions/chat";
import { Spinner } from "@/components/spinner";
import { Condition } from "@/lib/constants";
import { Message } from "@itell/core/chat";
import { Avatar, AvatarImage } from "@itell/ui/client";
import { User } from "lucia";
import { Chat } from "./chat/chat";

type Props = {
	user: User | null;
	pageSlug: string;
};

export const ChatLoader = async ({ user, pageSlug }: Props) => {
	if (!user || user.condition === Condition.STAIRS) return null;

	const [chats, err] = await getChatsAction({ pageSlug });
	if (!err) {
		const { data, updatedAt } = chats;
		const messages = data.map((d) => ({
			...d,
			id: crypto.randomUUID(),
		})) as Message[];

		return <Chat pageSlug={pageSlug} data={messages} updatedAt={updatedAt} />;
	}

	return null;
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
