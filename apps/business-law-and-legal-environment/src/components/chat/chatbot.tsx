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

export const Chatbot = async ({ pageSlug, data, updatedAt, user }: Props) => {
	return (
		<Accordion
			type="single"
			defaultValue={undefined}
			collapsible
			className="chatbot fixed right-8 bottom-12 w-80 lg:w-96 rounded-md bg-background border border-border z-30"
		>
			<AccordionItem value="item-1" className="overflow-hidden">
				<AccordionTrigger className="border border-border px-6">
					<ChatHeader />
				</AccordionTrigger>

				<AccordionContent className="">
					<div className="flex flex-col h-96">
						<ChatMessages
							user={user}
							isChunkQuestion={false}
							data={data}
							updatedAt={updatedAt}
						/>
						<ChatInput pageSlug={pageSlug} isChunkQuestion={false} />
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
