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
import { DatabaseIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PageCard } from "./page-card";
import { Spinner } from "./ui/spinner";

export const SearchStrapi = () => {
	const [open, setOpen] = useState(false);
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
					<DialogDescription>
						Search the page slug you want to load from strapi
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col gap-2"
					onSubmit={async (e) => {
						e.preventDefault();
						if (searchPending) return;
						setSearchPending(true);

						const formData = new FormData(e.currentTarget);
						const slug = String(formData.get("slug"));
						const page = await searchPage(slug);
						setSearchResult(page);
						setSearchPending(false);
					}}
				>
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
