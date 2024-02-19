import { getModuleChapters } from "@/lib/sidebar";
import { User } from "@prisma/client";
import { Page } from "contentlayer/generated";
import { ArrowUpIcon, PencilIcon } from "lucide-react";
import { Chatbot } from "./chat/chatbot";
import { Button } from "./client-components";
import { ModuleSidebar } from "./module-sidebar";
import { RestartPageButton } from "./page/restart-page-button";

const AnchorLink = ({
	text,
	href,
	icon,
}: { text: string; href: string; icon: React.ReactNode }) => {
	return (
		<a href={href} className="block">
			<Button
				variant="ghost"
				className="flex flex-wrap justify-start items-center gap-2 pl-0"
			>
				{icon}
				{text}
			</Button>
		</a>
	);
};

export const ModuleToc = ({
	page,
	user,
}: { page: Page; user: User | null }) => {
	const chapters = getModuleChapters(page.location.module);

	return (
		<>
			<ModuleSidebar
				chapters={chapters}
				currentPage={{
					chapter: page.location.chapter,
					section: page.location.section,
					url: page.url,
				}}
			/>
			<div className="mt-12 space-y-2">
				<Chatbot pageSlug={page.page_slug} user={user} />

				<RestartPageButton pageSlug={page.page_slug} />
				{page.summary && (
					<AnchorLink
						icon={<PencilIcon className="size-4" />}
						text="Write a summary"
						href="#page-summary"
					/>
				)}
				<AnchorLink
					icon={<ArrowUpIcon className="size-4" />}
					text="Back to top"
					href="#page-title"
				/>
			</div>
		</>
	);
};
