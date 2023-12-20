import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MainMdx } from "./mdx";
import { Button } from "./client-components";
import Link from "next/link";
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
			<DialogContent className="sm:max-w-3xl h-[800px] top-4 bottom-4 overflow-y-auto  ">
				<div className="flex justify-end mt-8">
					<Link href={page.url} className={buttonVariants()}>
						Go to page
					</Link>
				</div>

				<MainMdx code={page.body.code} />
			</DialogContent>
		</Dialog>
	);
};
