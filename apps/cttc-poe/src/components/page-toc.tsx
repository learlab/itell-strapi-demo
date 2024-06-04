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

const useIntersectionObserver = (headings: Heading[]) => {
	useEffect(() => {
		if (typeof window !== "undefined") {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					const id = entry.target.id;
					if (entry.isIntersecting) {
						document
							.querySelector(`div.page-toc ol li a[href="#${id}"]`)
							?.classList.add("bg-accent");
					} else {
						document
							.querySelector(`div.page-toc ol li a[href="#${id}"]`)
							?.classList.remove("bg-accent");
					}
				});
			});

			const sections = document.querySelectorAll("div[data-subsection-id]");
			sections.forEach((section) => {
				const renamedId = section.getAttribute("data-subsection-id");
				if (renamedId) {
					const lowercaseId = renamedId.toLowerCase();
					const slicedId = lowercaseId.split("-").slice(0, -1).join("-");
					if (headings.some((heading) => heading.slug === slicedId)) {
						section.id = slicedId;
						observer.observe(section);
					}
				}
			});

			return () => observer.disconnect();
		}
	}, [headings]);
};

export const PageToc = ({ headings, chunks }: TocSidebarProps) => {
	const editedHeadings = useMemo(() => {
		let headingsList = headings.map((heading) =>
			heading.slug?.toLocaleLowerCase(),
		);
		const editedChunks = chunks
			.map((chunk) => chunk.split("-").slice(0, -1).join("-"))
			.filter(onlyUnique);
		const updatedHeadings = [...headings];
		for (let i = 0; i < editedChunks.length; i++) {
			if (!headingsList.includes(editedChunks[i].toLocaleLowerCase())) {
				const target = editedChunks[i - 1];
				if (target) {
					const index =
						headingsList.findIndex(
							(value) => value === target.toLocaleLowerCase(),
						) + 1;
					updatedHeadings.splice(index, 0, {
						level:
							index === 0
								? "one"
								: headings.find(
										(value) => value.slug === target.toLocaleLowerCase(),
									)?.level ?? "one",
						text: editedChunks[i].split("-").join(" "),
						slug: editedChunks[i].toLocaleLowerCase(),
					});
					headingsList = updatedHeadings.map((heading) =>
						heading.slug?.toLocaleLowerCase(),
					);
				}
			}
		}
		return updatedHeadings;
	}, [headings, chunks]);

	useIntersectionObserver(editedHeadings);

	return (
		<div className="page-toc">
			<p className="font-medium flex items-center pb-2">
				<BookmarkIcon className="mr-2 size-4" />
				<span>ON THIS PAGE</span>
			</p>

			<ol className="max-h-[60vh] overflow-y-scroll mt-2 space-y-2 list-none">
				{editedHeadings
					.filter((heading) => heading.level !== "other")
					.map((heading) => (
						<li key={heading.slug}>
							<a
								data-level={heading.level}
								href={`#${heading.slug}`}
								className={cn(
									"hover:underline inline-flex px-1 rounded-md transition-colors ease-in-out delay-150 text-balance",
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
