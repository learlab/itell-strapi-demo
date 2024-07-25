import { SiteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { allPagesSorted } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import "@/styles/prism-material-dark.css";

export const generateStaticParams = async () => {
	return allPagesSorted.map((page) => {
		return {
			slug: page.page_slug,
		};
	});
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const page = allPagesSorted.find((page) => page.page_slug === params.slug);
	if (!page) {
		return {
			title: "Not Found",
		};
	}

	const title = `${page.title} | ${SiteConfig.title}`;
	const description = page.description || page.body.raw.slice(0, 100);
	const ogUrl = new URL(`${env.HOST}/og`);
	ogUrl.searchParams.set("title", page.title);
	ogUrl.searchParams.set("slug", page.page_slug);

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "article",
			url: `${env.HOST}${makePageHref(page.page_slug)}`,
			images: [
				{
					url: ogUrl,
				},
			],
		},
	};
};

export default async function ({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
