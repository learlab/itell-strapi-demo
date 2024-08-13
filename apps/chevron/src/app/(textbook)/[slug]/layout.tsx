import { TextbookNav } from "@/components/textbook-nav";
import { SiteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { allPagesSorted } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { Fragment } from "react";

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

	const title = page.title;
	const description = page.description || page.excerpt;
	const ogUrl = new URL(`${env.HOST}/og`);
	ogUrl.searchParams.set("title", page.title);
	ogUrl.searchParams.set("slug", page.page_slug);

	return {
		title,
		description,
		openGraph: {
			title: `${title} | ${SiteConfig.title}`,
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
	return (
		<Fragment>
			<TextbookNav scrollProgress />
			{children}
		</Fragment>
	);
}
