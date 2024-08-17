"use client";
import {
	PageData,
	SearchPageResult,
	Volume,
	searchPage,
	searchPages,
	searchVolumes,
} from "@/lib/strapi";
import { rewriteSearchParams } from "@/lib/utils";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
	Label,
	RadioGroup,
	RadioGroupItem,
	ScrollArea,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@itell/ui/client";
import { CornerDownLeft, DatabaseIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { PageCard } from "./page-card";
import { Spinner } from "./ui/spinner";

export const SearchStrapi = () => {
	const [open, setOpen] = useState(false);
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const onLoad = (id: number) => {
		const url = new URL(window.location.href);
		rewriteSearchParams(url, { page: String(id) });
		startTransition(() => {
			router.push(url.toString());
			setOpen(false);
		});
	};

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
				<Tabs defaultValue="slug">
					<TabsList>
						<TabsTrigger value="slug">By page slug</TabsTrigger>
						<TabsTrigger value="volume">By volume</TabsTrigger>
					</TabsList>
					<TabsContent value="slug">
						<SearchPageSlug pending={pending} onLoad={onLoad} />
					</TabsContent>
					<TabsContent value="volume">
						<SearchVolume pending={pending} onLoad={onLoad} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

const SearchVolume = ({
	pending,
	onLoad,
}: { pending: boolean; onLoad: (id: number) => void }) => {
	const [volumes, setVolumes] = useState<Volume[]>([]);
	const [volumeSlug, setVolumeSlug] = useState<string | undefined>();
	const [getVolumesPending, setGetVolumesPending] = useState(false);
	const [getPagesPending, setGetPagesPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pages, setPages] = useState<SearchPageResult[]>([]);

	const getVolumes = async () => {
		setGetVolumesPending(true);
		setVolumes([]);
		setError(null);
		const result = await searchVolumes();
		if (!result || result.length === 0) {
			setError("No volume found");
		} else {
			setVolumes(result);
		}
		setGetVolumesPending(false);
	};

	useEffect(() => {
		getVolumes();
	}, []);

	useEffect(() => {
		if (volumeSlug) {
			setGetPagesPending(true);
			setPages([]);
			setError(null);
			searchPages({ volumeSlug }).then((pages) => {
				if (!pages || pages.length === 0) {
					setError("No pages found for volume");
				} else {
					setPages(pages);
				}
			});
			setGetPagesPending(false);
		}
	}, [volumeSlug]);

	return (
		<div className="space-y-2">
			<form
				className="flex flex-col gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					onLoad(Number(formData.get("page")));
				}}
			>
				<Select value={volumeSlug} onValueChange={setVolumeSlug}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select a volume" />
					</SelectTrigger>
					<SelectContent>
						{getVolumesPending ? (
							<div className="flex items-center justify-center">
								<Spinner className="size-4" />
							</div>
						) : (
							<ScrollArea className="h-[200px]">
								{volumes.map((volume) => (
									<SelectItem key={volume.slug} value={volume.slug}>
										{volume.title}
									</SelectItem>
								))}
							</ScrollArea>
						)}
					</SelectContent>
				</Select>

				{getPagesPending ? (
					<div className="flex items-center justify-center">
						<Spinner />
					</div>
				) : (
					<RadioGroup className="p-2 space-y-2" name="page">
						{pages.map((p) => (
							<div key={p.slug} className="flex items-center gap-2">
								<RadioGroupItem key={p.id} value={String(p.id)} />
								<Label>{p.title}</Label>
							</div>
						))}
					</RadioGroup>
				)}
				{error && <p className="text-sm text-muted-foreground">{error}</p>}

				<footer className="flex justify-end">
					<Button disabled={pending} pending={pending} type="submit">
						Load
					</Button>
				</footer>
			</form>
		</div>
	);
};

const SearchPageSlug = ({
	pending,
	onLoad,
}: {
	pending: boolean;
	onLoad: (id: number) => void;
}) => {
	const [slug, setSlug] = useState("");
	const [searchResult, setSearchResult] = useState<
		SearchPageResult | null | undefined
	>(undefined);

	const [searchPending, setSearchPending] = useState(false);
	const [debouncedSlug] = useDebounce(slug, 500);
	useEffect(() => {
		if (debouncedSlug) {
			form.current?.requestSubmit();
		}
	}, [debouncedSlug]);

	const form = useRef<HTMLFormElement>(null);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchPending) return;
		setSearchPending(true);

		const page = await searchPage(slug);
		setSearchResult(page);
		setSearchPending(false);
	};

	return (
		<div className="space-y-2">
			<form className="flex flex-col gap-2" onSubmit={onSubmit} ref={form}>
				<Label className="inline-flex items-center gap-1 [&:has(:focus-visible)]:ring-4 rounded-md p-2">
					<span className="sr-only">search by page slug</span>
					{searchPending ? (
						<Spinner className="size-4 opacity-50" />
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
				<div className="space-y-2">
					<PageCard title={searchResult.title} volume={searchResult.volume} />
					<div className="flex justify-end">
						<Button
							pending={pending}
							disabled={pending || searchPending}
							onClick={() => onLoad(searchResult.id)}
						>
							Load
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
