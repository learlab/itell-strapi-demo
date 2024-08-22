import { ProseContent } from "@/components/mdx";
import { TextbookComponents } from "@/components/mdx-components";
import { PageLink } from "@/components/page-link";
import { Button } from "@itell/ui/button";
import { buttonVariants } from "@itell/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@itell/ui/dialog";
import { Page } from "#content";

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
					<PageLink pageSlug={page.slug} className={buttonVariants()}>
						Go to page
					</PageLink>
				</div>

				<ProseContent html={page.html} components={TextbookComponents} />
			</DialogContent>
		</Dialog>
	);
};
