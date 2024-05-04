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
	chunks: string[];
};

function onlyUnique(value: string, index: number, array: string[]) {
	return array.indexOf(value) === index;
}

export const PageToc = ({ headings, chunks }: TocSidebarProps) => {
	const editedHeadings = useMemo(() => {
		let headingsList = headings.map((heading) =>
			heading.slug?.toLocaleLowerCase(),
		);
		const editedChunks = chunks
			.map((chunk) => chunk.split("-").slice(0, -1).join("-"))
			.filter(onlyUnique);
		const editedHeadings = headings;
		for (let i = 0; i < editedChunks.length; i++) {
			if (!headingsList.includes(editedChunks[i].toLocaleLowerCase())) {
				const target = editedChunks[i - 1];
				if (target) {
					const index =
						headingsList.findIndex(
							(value) => value === target.toLocaleLowerCase(),
						) + 1;
					editedHeadings.splice(index, 0, {
						level:
							index === 0
								? "one"
								: headings.find(
										(value) => value.slug === target.toLocaleLowerCase(),
									)?.level ?? "one",
						text: editedChunks[i].split("-").join(" "),
						slug: editedChunks[i].toLocaleLowerCase(),
					});
					headingsList = editedHeadings.map((heading) =>
						heading.slug?.toLocaleLowerCase(),
					);
				}
			}
		}
		return editedHeadings;
	}, [headings, chunks]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.addEventListener("DOMContentLoaded", () => {
				const observer = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						const id = entry.target.id;
						if (entry.intersectionRatio > 0) {
							document
								.querySelector(`div.page-toc ol li a[href="#${id}"]`)
								?.classList.remove("border-transparent");
						} else {
							document
								.querySelector(`div.page-toc ol li a[href="#${id}"]`)
								?.classList.add("border-transparent");
						}
					});
				});

				// Track all sections that have an `id` applied
				document
					.querySelectorAll("div[data-subsection-id]")
					.forEach((section) => {
						const renamedId = section.getAttribute("data-subsection-id");
						if (renamedId) {
							const lowercaseId = renamedId.toLowerCase();
							const slicedId = lowercaseId.split("-").slice(0, -1).join("-");
							if (
								editedHeadings.map((heading) => heading.slug).includes(slicedId)
							) {
								section.id = slicedId;
								observer.observe(section);
							}
						}
					});
			});
		}
	}, [editedHeadings]);

	return (
		<div className="page-toc">
			<p className="font-medium flex items-center pb-2">
				<BookmarkIcon className="mr-2 size-4" />
				<span>ON THIS PAGE</span>
			</p>

			<ol className="max-h-[60vh] overflow-y-scroll list-disc mt-2 space-y-2 list-none">
				{editedHeadings
					.filter((heading) => heading.level !== "other")
					.map((heading) => (
						<li key={heading.slug}>
							<a
								data-level={heading.level}
								href={`#${heading.slug}`}
								className={cn(
									"hover:underline inline-flex border-l-2 border-transparent",
									{
										"text-base pl-1": heading.level === "two",
										"text-sm pl-3": heading.level === "three",
										"text-sm pl-5 text-muted-foreground":
											heading.level === "four",
										"text-muted-foreground text-sm pl-6":
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
