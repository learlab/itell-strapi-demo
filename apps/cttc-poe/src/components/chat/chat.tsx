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
	user: NonNullable<SessionUser>;
	pageSlug: string;
	data: Message[];
	updatedAt: Date;
};

export const Chat = async ({ pageSlug, data, updatedAt, user }: Props) => {
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
							user={user}
							isStairs={false}
							updatedAt={updatedAt}
						/>
						<ChatInput pageSlug={pageSlug} isStairs={false} />
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
