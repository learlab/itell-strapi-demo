import { MainMdx } from "@/components/mdx";
import { PageLink } from "@/components/page-link";
import { Button, Dialog, DialogContent, DialogTrigger } from "@itell/ui/client";
import { buttonVariants } from "@itell/ui/server";
import { Page } from "contentlayer/generated";

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
			<DialogContent className="sm:max-w-3xl h-[800px] top-4 bottom-4 overflow-y-auto translate-y-0 ">
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
