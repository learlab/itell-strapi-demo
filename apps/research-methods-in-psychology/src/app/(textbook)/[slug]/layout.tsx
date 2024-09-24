import { MainNav } from "@/components/main-nav";
import { SiteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { allPagesSorted, getPage } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";
import { Fragment } from "react";

export const generateStaticParams = async () => {
	return allPagesSorted.map((page) => {
		return {
			slug: page.slug,
		};
	});
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const page = getPage(params.slug);
	if (!page) {
		return {
			title: "Not Found",
		};
	}

	const title = page.title;
	const description = page.description || page.excerpt;
	const ogUrl = new URL(`${env.NEXT_PUBLIC_HOST}/og`);
	ogUrl.searchParams.set("title", page.title);
	ogUrl.searchParams.set("slug", page.slug);

	return {
		title,
		description,
		openGraph: {
			title: `${title} | ${SiteConfig.title}`,
			description,
			type: "article",
			url: `${env.NEXT_PUBLIC_HOST}${makePageHref(page.slug)}`,
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
			<MainNav scrollProgress />
			{children}
		</Fragment>
	);
}
