import { Chapter } from "contentlayer/generated";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTrigger,
} from "./client-components";
import Link from "next/link";
import { buttonVariants } from "@itell/ui/server";
import { MainMdx } from "./main-mdx";

export const TextbookPageModal = ({
	chapter,
	title,
}: { chapter: Chapter; title?: string }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" className="text-lg font-bold underline">
					{title ? title : chapter.title}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-3xl h-[800px] top-4 bottom-4 overflow-y-auto  ">
				<div className="flex justify-end mt-8">
					<Link href={chapter.url} className={buttonVariants()}>
						Go to section
					</Link>
				</div>

				<MainMdx code={chapter.body.code} />
			</DialogContent>
		</Dialog>
	);
};
