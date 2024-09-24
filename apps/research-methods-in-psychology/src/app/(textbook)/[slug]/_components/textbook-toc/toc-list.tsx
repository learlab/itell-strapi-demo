"use client";
import { Elements } from "@itell/constants";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@itell/ui/accordion";
import { startTransition, useOptimistic } from "react";
import { Page } from "#content";
import { TocPagesWithStatus } from ".";
import { TocItem } from "./toc-item";

type Props = {
	page: Page;
	pages: TocPagesWithStatus;
};

export const TextbookTocList = ({ page, pages }: Props) => {
	const [activePage, setActivePage] = useOptimistic(page.slug);
	return (
		<nav aria-label="textbook primary">
			<a className="sr-only" href={`#${Elements.TEXTBOOK_MAIN}`}>
				skip to main content
			</a>
			<ol
				aria-label="list of chapters"
				className="leading-relaxed tracking-tight"
			>
				{pages.map((item) => {
					if (!item.group) {
						return (
							<TocItem
								key={item.slug}
								inGroup={false}
								onClick={(slug) =>
									startTransition(() => {
										setActivePage(slug);
									})
								}
								activePage={activePage}
								item={item}
							/>
						);
					}

					return (
						<Accordion
							type="single"
							collapsible
							key={item.title}
							defaultValue={page.parent?.slug}
							className="pb-0"
						>
							<AccordionItem value={item.slug} className="border-none">
								<AccordionTrigger className="text-left text-base lg:text-lg 2xl:text-xl hover:no-underline  hover:bg-accent px-2 py-4">
									{item.title}
								</AccordionTrigger>
								<AccordionContent className="pb-0">
									{item.pages.map((p) => (
										<TocItem
											key={p.slug}
											onClick={() => {
												startTransition(() => {
													setActivePage(p.slug);
												});
											}}
											item={p}
											inGroup={true}
											activePage={activePage}
										/>
									))}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					);
				})}
			</ol>
		</nav>
	);
};
