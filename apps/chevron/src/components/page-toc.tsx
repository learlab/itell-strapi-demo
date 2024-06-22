"use client";

import { cn } from "@itell/core/utils";
import { BookmarkIcon } from "lucide-react";
import { useEffect } from "react";

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
						?.classList.add("bg-accent");
					if (isUsingMostRecentHeading) {
						document
							.querySelector(
								`div.page-toc ol li a[href="#${mostRecentHeading}"]`,
							)
							?.classList.remove("bg-accent");
					}
					mostRecentHeading = id;
				} else {
					document
						.querySelector(`div.page-toc ol li a[href="#${id}"]`)
						?.classList.remove("bg-accent");
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
					?.classList.add("bg-accent");
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
			<p className="font-medium flex items-center pb-2">
				<BookmarkIcon className="mr-2 size-4" />
				<span>ON THIS PAGE</span>
			</p>

			<ol className="max-h-[60vh] overflow-y-scroll mt-2 space-y-2 list-none">
				{headings
					.filter((heading) => heading.level !== "other")
					.map((heading) => (
						<li key={heading.slug}>
							<a
								data-level={heading.level}
								href={`#${heading.slug}`}
								className={cn(
									"hover:underline inline-flex py-0.5 px-1 transition-colors ease-in-out delay-150",
									{
										"text-base ml-1": heading.level === "two",
										"text-sm ml-3": heading.level === "three",
										"text-sm ml-5 text-muted-foreground":
											heading.level === "four",
										"text-muted-foreground text-sm ml-6":
											heading.level === "other",
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
