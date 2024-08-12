"use client";
import { makePageHref } from "@/lib/utils";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { cn } from "@itell/utils";
import { useRouter } from "next/navigation";
import data from "public/data/graph.json";
import React, { useEffect, useId, useRef, useTransition } from "react";

const getChunkPage = (chunk: string) => {
	const page = data.edges.find(
		(edge) => edge.label === "page-chunk" && edge.target === chunk,
	);
	if (page) {
		return makePageHref(page.source, chunk);
	}
	return "#";
};

const controller = new AbortController();
const signal = controller.signal;
export const CustomLink = ({
	href,
	children,
	className,
	...rest
}: React.ComponentPropsWithRef<"a">) => {
	const button = useRef<HTMLButtonElement>(null);
	const id = useId();
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		const target = document.getElementById(id) as HTMLElement;
		button.current?.addEventListener(
			"mouseenter",
			() => {
				timeout = setTimeout(() => {
					if (button.current && target) {
						target.showPopover();
						computePosition(button.current, target, {
							placement: "top",
							strategy: "absolute",
							middleware: [flip(), shift({ padding: 5 }), offset(6)],
						}).then(({ x, y }) => {
							Object.assign(target.style, {
								left: `${x}px`,
								top: `${y}px`,
							});
						});
					}
				}, 500);
			},
			{ signal },
		);

		button.current?.addEventListener("mouseleave", () => {
			clearTimeout(timeout);
		});

		return () => {
			controller.abort();
		};
	}, []);

	if (className?.includes("wiki-link")) {
		const props = rest as Record<string, any>;
		const linkId = props["data-link-id"];
		const linkType = props["data-link-type"];
		const href =
			linkType === "page"
				? makePageHref(linkId)
				: linkType === "chunk"
					? getChunkPage(linkId)
					: "#";
		return (
			<>
				<button
					disabled={pending}
					type="button"
					ref={button}
					className={cn(
						"underline underline-offset-4 decoration-warning decoration-4 font-semibold",
						className,
					)}
					onClick={() => {
						startTransition(() => {
							router.push(href);
						});
					}}
					popoverTarget={id}
				>
					{children}
				</button>
				<div
					id={id}
					popover="auto"
					className="rounded-md shadow-lg border p-4 w-64 tooltip"
				>
					A custom link (WIP)
					<div className="flex justify-end">
						<a className="underline" href={href}>
							visit
						</a>
					</div>
				</div>
			</>
		);
	}

	return (
		<a href={href} className={className} {...rest}>
			{children}
		</a>
	);
};
