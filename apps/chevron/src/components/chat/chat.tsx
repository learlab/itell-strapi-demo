import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/client-components";
import { SessionUser } from "@/lib/auth";
import { Message } from "@itell/core/chatbot";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	userId: string;
	userName: string | null;
	userImage: string | null;
	pageSlug: string;
	data: Message[];
	updatedAt: Date;
};

export const Chat = async ({
	userId,
	userName,
	userImage,
	pageSlug,
	data,
	updatedAt,
}: Props) => {
	return (
		<Accordion
			type="single"
			defaultValue={undefined}
			collapsible
			className="fixed right-8 bottom-12 w-80 lg:w-96 rounded-md bg-background text-foreground border border-border z-30 chatbot"
		>
			<AccordionItem value="item-1" className="overflow-hidden">
				<AccordionTrigger className="border border-border px-6">
					<ChatHeader />
				</AccordionTrigger>

				<AccordionContent className="">
					<div className="flex flex-col h-96">
						<ChatMessages
							data={data}
							userImage={userImage}
							userName={userName}
							isStairs={false}
							updatedAt={updatedAt}
						/>
						<ChatInput pageSlug={pageSlug} userId={userId} />
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
