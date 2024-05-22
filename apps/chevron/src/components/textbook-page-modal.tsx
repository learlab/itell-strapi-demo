import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@itell/ui/server";
import { Page } from "contentlayer/generated";
import { Button } from "./client-components";
import { MainMdx } from "./mdx";
import { PageLink } from "./page/page-link";

export const TextbookPageModal = ({
	page,
	title,
}: { page: Page; title?: string }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" className="text-lg font-bold underline">
					{title ? title : page.title}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-3xl h-[800px] top-4 bottom-4 overflow-y-auto  ">
				<div className="flex justify-end mt-8">
					<PageLink pageSlug={page.page_slug} className={buttonVariants()}>
						Go to page
					</PageLink>
				</div>

				<MainMdx code={page.body.code} />
			</DialogContent>
		</Dialog>
	);
};
