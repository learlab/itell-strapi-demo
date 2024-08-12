"use client";

import { Elements } from "@itell/constants";
import { extractHeadingsFromMdast } from "@itell/content";
import { cn } from "@itell/utils";
import { useEffect } from "react";

type TocSidebarProps = {
	headings: ReturnType<typeof extractHeadingsFromMdast>;
};

export const PageToc = ({ headings }: TocSidebarProps) => {
	useEffect(() => {
		let mostRecentHeading: string | null = null;
		let isUsingMostRecentHeading = false;
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const id = entry.target.id;
				if (entry.intersectionRatio > 0) {
					document
						.querySelector(`div.page-toc ol li a[href="#${id}"]`)
						?.classList.add(Elements.PAGE_NAV_ACTIVE);
					if (isUsingMostRecentHeading) {
						document
							.querySelector(
								`div.page-toc ol li a[href="#${mostRecentHeading}"]`,
							)
							?.classList.remove(Elements.PAGE_NAV_ACTIVE);
					}
					mostRecentHeading = id;
				} else {
					document
						.querySelector(`div.page-toc ol li a[href="#${id}"]`)
						?.classList.remove(Elements.PAGE_NAV_ACTIVE);
				}
			});
			if (
				entries
					.map((entry) => entry.intersectionRatio)
					.reduce((partialSum, a) => partialSum + a, 0) === 0
			) {
				isUsingMostRecentHeading = true;
				document
					.querySelector(`.page-toc ol li a[href="#${mostRecentHeading}"]`)
					?.classList.add(Elements.PAGE_NAV_ACTIVE);
			}
		});

		for (const heading of headings) {
			const element = document.getElementById(heading.slug || "");
			if (element) {
				observer.observe(element);
			}
		}

		return () => {
			observer.disconnect();
		};
	}, [headings]);

	return (
		<div className="page-toc space-y-4 px-1">
			<a className="sr-only" href={`#${Elements.TEXTBOOK_MAIN}`}>
				skip to main content
			</a>
			<div className="flex items-center gap-2">
				<div className="rounded-full ring-2 ring-blue-400 size-3" />
				<h3 className="font-semibold">On this page</h3>
			</div>
			<ol className="flex flex-col list-none text-foreground/70 tracking-tight">
				{headings
					.filter((heading) => heading.depth <= 4)
					.map((heading) => (
						<li
							key={heading.slug}
							className={cn(
								"hover:underline inline-flex py-0.5 my-1 transition-colors ease-out delay-150 ",
								{
									"text-base": heading.depth === 2,
									"text-sm ml-2": heading.depth === 3,
									"text-sm ml-4": heading.depth === 4,
								},
							)}
						>
							<a
								data-depth={heading.depth}
								href={`#${heading.slug}`}
								className="text-pretty"
							>
								{heading.text}
							</a>
						</li>
					))}
			</ol>
		</div>
	);
};
