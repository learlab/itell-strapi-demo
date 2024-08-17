"use client";
import { rewriteSearchParams } from "@/lib/utils";
import {
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@itell/ui/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { examples } from "#content";

const options = examples.map((example) => ({
	slug: example.slug,
	title: example.title,
}));

export const ExampleSelect = ({
	initialSlug,
}: { initialSlug: string | undefined }) => {
	const [slug, setSlug] = useState(initialSlug);
	const router = useRouter();

	useEffect(() => {
		if (slug) {
			const url = new URL(window.location.href);
			rewriteSearchParams(url, { example: slug });
			router.push(url.toString());
		}
	}, [slug]);

	return (
		<form className="my-4">
			<Label className="flex gap-2 items-center">
				<p className="font-semibold">Example</p>
				<Select value={slug} onValueChange={setSlug}>
					<SelectTrigger className="w-[300px]">
						<SelectValue placeholder="Select an example" />
					</SelectTrigger>
					<SelectContent>
						{options.map((opt) => (
							<SelectItem key={opt.slug} value={opt.slug}>
								{opt.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Label>
		</form>
	);
};
