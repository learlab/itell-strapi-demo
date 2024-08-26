import htmr from "htmr";
import { reference } from "#content";
import { ReferenceToc } from "./reference-toc";
import { TryExample } from "./ui/try-example";

export const Reference = () => {
	return (
		<div className="grid grid-cols-[200px_1fr] gap-2">
			<ReferenceToc />
			<div className="prose dark:prose-invert max-w-3xl">
				{htmr(reference.content, {
					transform: {
						// @ts-ignore
						"i-try-example": TryExample,
					},
				})}
			</div>
		</div>
	);
};
