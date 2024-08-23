"use client";

import { allPagesSorted } from "@/lib/pages";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@itell/ui/select";
import { useRouter } from "next/navigation";

const allPages = allPagesSorted.map((p) => ({
	title: p.title,
	slug: p.slug,
}));

export const SummaryListSelect = ({
	pageSlug,
}: {
	pageSlug: string | undefined;
}) => {
	const router = useRouter();
	return (
		<Select
			defaultValue={pageSlug}
			onValueChange={(val) => {
				if (val === "all") {
					router.push("/dashboard/summaries");
				} else {
					const url = new URL(window.location.href);
					url.searchParams.set("page", val);
					router.push(url.toString());
				}
			}}
		>
			<SelectTrigger className="w-72">
				<SelectValue placeholder="Page" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Select a page</SelectLabel>
					<SelectItem value="all">All pages</SelectItem>
					{allPages.map((p) => (
						<SelectItem key={p.slug} value={p.slug}>
							{p.title}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
