import { getChatsAction } from "@/actions/chat";
import { Spinner } from "@/components/spinner";
import { getUserCondition } from "@/lib/auth/conditions";
import { Condition } from "@/lib/constants";
import { Message } from "@itell/core/chat";
import { Avatar, AvatarImage } from "@itell/ui/avatar";
import { User } from "lucia";

import { Chat } from "./chat/chat";

type Props = {
  user: User | null;
  pageSlug: string;
  pageTitle: string;
};

export const ChatLoader = async ({ user, pageSlug, pageTitle }: Props) => {
  if (!user || getUserCondition(user, pageSlug) !== Condition.STAIRS)
    return null;

  const [chats, err] = await getChatsAction({ pageSlug });
  if (!err) {
    const { data, updatedAt } = chats;
    const messages = data.map((d) => ({
      id: crypto.randomUUID(),
      text: d.text,
      isUser: d.is_user,
      context: d.context,
      transform: d.transform,
    })) as Message[];

    return (
      <Chat
        pageSlug={pageSlug}
        updatedAt={new Date(updatedAt)}
        data={messages}
        pageTitle={pageTitle}
      />
    );
  }

  return null;
};

ChatLoader.Skeleton = () => (
  <div className="fixed bottom-12 right-8 z-30 flex w-80 items-center gap-2 rounded-lg border border-border bg-background p-4 shadow-lg lg:w-96">
    <Avatar className="h-8 w-8 rounded-none">
      <AvatarImage src="/images/itell-ai.svg" />
    </Avatar>
    <span>ITELL AI</span>
    <Spinner />
  </div>
);
