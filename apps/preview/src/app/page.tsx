import { Editor } from "@/components/editor";
import { ExampleSelect } from "@/components/example-select";
import { PageCard } from "@/components/page-card";
import { Preview } from "@/components/preview";
import { PreviewController } from "@/components/preview-controller";
import { Reference } from "@/components/reference";
import { SearchStrapi } from "@/components/search-strapi";
import { Share } from "@/components/share";
import { ThemeToggle } from "@/components/theme-toggle";
import { Split } from "@/components/ui/split";
import { routes } from "@/lib/navigation";
import { PageData, getPage } from "@/lib/strapi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/client";
import { examples } from "#content";
import { HomeProvider } from "./home-provider";

type PageProps = {
	params: { slug: string };
	searchParams?: { [key: string]: string | string[] | undefined };
};

examples.sort((a, b) => a.order - b.order);
const defaultExample = examples.find(
	(example) => example.slug === "basic-markdown",
);

export default async function Home({ searchParams }: PageProps) {
	const { page, text, example } = routes.home.$parseSearchParams(searchParams);
	let initialValue = defaultExample?.content || "";
	let initialSlug: string | undefined = defaultExample?.slug || undefined;
	let pageData: PageData | null = null;

	try {
		if (page !== undefined) {
			pageData = await getPage(page);
			if (pageData) {
				initialValue = pageData.content.join("\n");
				initialSlug = undefined;
			}
		} else if (text !== undefined) {
			initialValue = atob(text);
			initialSlug = undefined;
		} else if (example !== undefined) {
			const exampleData = examples.find((e) => e.slug === example);
			if (exampleData) {
				initialValue = exampleData.content;
				initialSlug = exampleData.slug;
			}
		}
	} catch (err) {
		console.log(err);
		initialValue = defaultExample?.content || "";
		initialSlug = defaultExample?.slug || undefined;
	}

	return (
		<HomeProvider initialValue={initialValue}>
			<div className="flex justify-center gap-4 items-center">
				<h1 className="text-2xl tracking-tight font-extrabold leading-tight text-center">
					iTELL Markdown Preview
				</h1>
				<ThemeToggle />
			</div>

			{pageData && <PageCard title={pageData.title} volume={pageData.volume} />}

			<Tabs defaultValue="preview">
				<TabsList>
					<TabsTrigger value="preview">Preview</TabsTrigger>
					<TabsTrigger value="reference">Reference</TabsTrigger>
				</TabsList>
				<TabsContent value="preview">
					<div className="flex items-center justify-between">
						<ExampleSelect initialSlug={initialSlug} />
						<div className="space-x-2">
							<SearchStrapi />
							<Share />
						</div>
					</div>
					<Split
						direction="horizontal"
						minSize={100}
						expandToMin={false}
						sizes={[50, 50]}
						gutterSize={10}
						snapOffset={30}
						className="flex gap-4"
					>
						<section aria-label="editor" className="basis-[100%]">
							<Editor />
						</section>
						<section aria-label="preview" className="basis-[100%]">
							<PreviewController />
						</section>
					</Split>
				</TabsContent>
				<TabsContent value="reference">
					<Reference />
				</TabsContent>
			</Tabs>
		</HomeProvider>
	);
}
