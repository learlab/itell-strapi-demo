"use client";

import { cn } from "@itell/core/utils";
import { BookmarkIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

type Heading = {
	level: "one" | "two" | "three" | "four" | "other";
	text: string | undefined;
	slug: string | undefined;
};
type TocSidebarProps = {
	headings: Heading[];
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
						?.classList.add("page-toc-active");
					if (isUsingMostRecentHeading) {
						document
							.querySelector(
								`div.page-toc ol li a[href="#${mostRecentHeading}"]`,
							)
							?.classList.remove("page-toc-active");
					}
					mostRecentHeading = id;
				} else {
					document
						.querySelector(`div.page-toc ol li a[href="#${id}"]`)
						?.classList.remove("page-toc-active");
				}
			});
			if (
				entries
					.map((entry) => entry.intersectionRatio)
					.reduce((partialSum, a) => partialSum + a, 0) === 0
			) {
				isUsingMostRecentHeading = true;
				document
					.querySelector(`div.page-toc ol li a[href="#${mostRecentHeading}"]`)
					?.classList.add("page-toc-active");
			}
		});

		// Track all sections that have an `id` applied
		for (const heading of headings) {
			const element = document.getElementById(heading.slug || "");
			if (element) {
				observer.observe(element);
			}
		}
	}, []);

	return (
		<div className="page-toc">
			<p
				id="page-toc-heading"
				aria-level={2}
				role="heading"
				className="font-semibold mb-4"
			>
				<span className="flex items-center gap-2">
					<BookmarkIcon className="size-4" />
					On this page
				</span>
			</p>

			<ol
				aria-labelledby="page-toc-heading"
				className="mt-2 space-y-2 list-none text-foreground/70 tracking-tight"
			>
				{headings
					.filter((heading) => heading.level !== "other")
					.map((heading) => (
						<li key={heading.slug}>
							<a
								data-level={heading.level}
								href={`#${heading.slug}`}
								className={cn(
									"hover:underline inline-flex rounded-md py-0.5 px-1 transition-colors ease-out delay-150",
									{
										"text-base pl-1": heading.level === "two",
										"text-sm pl-3": heading.level === "three",
										"text-sm pl-5": heading.level === "four",
										" text-sm pl-6": heading.level === "other",
									},
								)}
							>
								{heading.text}
							</a>
						</li>
					))}
			</ol>
		</div>
	);
};
