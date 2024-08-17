"use client";
import { searchPage } from "@/lib/strapi";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
	Label,
} from "@itell/ui/client";
import { Card, CardDescription, CardHeader, CardTitle } from "@itell/ui/server";
import { cn } from "@itell/utils";
import { CornerDownLeft, DatabaseIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { PageCard } from "./page-card";
import { Spinner } from "./ui/spinner";

export const SearchStrapi = () => {
	const [open, setOpen] = useState(false);
	const [slug, setSlug] = useState("");
	const form = useRef<HTMLFormElement>(null);
	const [debouncedSlug] = useDebounce(slug, 500);
	const [searchPending, setSearchPending] = useState(false);
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const [searchResult, setSearchResult] = useState<
		| {
				title: string;
				slug: string;
				volume: string | null;
				id: number;
		  }
		| null
		| undefined
	>(undefined);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchPending) return;
		setSearchPending(true);

		const page = await searchPage(slug);
		setSearchResult(page);
		setSearchPending(false);
	};

	useEffect(() => {
		if (debouncedSlug) {
			form.current?.requestSubmit();
		}
	}, [debouncedSlug]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"outline"} className="gap-2">
					<DatabaseIcon className="size-4" />
					From Strapi
				</Button>
			</DialogTrigger>
			<DialogContent className="space-y-2">
				<DialogHeader>
					<DialogDescription asChild>
						<p className="text-sm text-muted-foreground flex items-center gap-2">
							<span>Input the page slug to load</span>{" "}
							<CornerDownLeft className="size-4" />
						</p>
					</DialogDescription>
				</DialogHeader>
				<form className="flex flex-col gap-2" onSubmit={onSubmit} ref={form}>
					<Label className="inline-flex items-center gap-1 [&:has(:focus-visible)]:ring-4 rounded-md p-2">
						<span className="sr-only">search by page slug</span>
						{searchPending ? (
							<Spinner />
						) : (
							<SearchIcon className="size-4 opacity-50" />
						)}
						<input
							type="search"
							name="slug"
							placeholder="page slug"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							className="inline-block focus:outline-none py-1 px-2 flex-1"
						/>
					</Label>
				</form>
				{searchResult === null && (
					<p className="text-sm text-muted-foreground">no page found</p>
				)}
				{searchResult && (
					<>
						<PageCard
							title={searchResult.title}
							volume={searchResult.volume}
							className={searchPending ? "opacity-50" : ""}
						/>
						<Button
							pending={pending || searchPending}
							disabled={pending || searchPending}
							onClick={() => {
								const url = new URL(window.location.href);
								url.searchParams.set("page", searchResult.id.toString());
								startTransition(() => {
									router.push(url.toString());
									setOpen(false);
									setSearchResult(undefined);
								});
							}}
						>
							Load
						</Button>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};
