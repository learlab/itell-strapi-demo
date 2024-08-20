import { PageCard } from "@/components/page-card";
import { Preview } from "@/components/preview";
import { routes } from "@/lib/navigation";
import { getPage } from "@/lib/strapi";
import { buttonVariants } from "@itell/ui/server";
import { cn } from "@itell/utils";
import Link from "next/link";

export default async function ({ searchParams }: { searchParams: unknown }) {
	const { page } = routes.preview.$parseSearchParams(searchParams);
	const data = await getPage(page);
	if (!data) {
		throw "page not found";
	}

	const html = data.content.join("\n");

	return (
		<div className="grid grid-cols-3 gap-8 items-start">
			<Preview className="min-h-[50vh] col-span-2" html={html} />
			<div className="flex flex-col gap-2">
				<PageCard title={data.title} volume={data.volume} />
				<Link
					href={"/"}
					className={cn(buttonVariants({ variant: "secondary" }))}
				>
					Home
				</Link>
			</div>
		</div>
	);
}
