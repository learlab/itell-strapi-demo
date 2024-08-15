import { reference } from "velite/generated";
import { Toc } from "./toc";

export const Reference = () => {
	return (
		<div className="grid grid-cols-[200px_1fr] gap-2">
			<Toc />
			<div
				dangerouslySetInnerHTML={{ __html: reference.content }}
				className="prose dark:prose-invert max-w-3xl"
			/>
		</div>
	);
};
