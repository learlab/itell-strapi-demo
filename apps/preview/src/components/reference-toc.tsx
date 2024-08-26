import { cn } from "@itell/utils";
import { examples, reference } from "#content";

const headings = reference.headings;

export const ReferenceToc = () => {
	return (
		<aside className="sticky top-12 h-[calc(100vh-3.5rem)]">
			<nav className="px-2">
				<ol className="flex flex-col gap-2">
					{headings?.map((heading) => (
						<li
							key={heading}
							className={cn(
								"hover:underline inline-flex py-0.5 my-1 transition-colors ease-out delay-150 ",
							)}
						>
							<a href={`#module_${heading}`}>{heading}</a>
						</li>
					))}
				</ol>
			</nav>
		</aside>
	);
};
