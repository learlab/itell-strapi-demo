import { env } from "@/env.mjs";
import { allPagesSorted } from "@/lib/pages";
import { Page } from "contentlayer/generated";

export const generateStaticParams = async () => {
	return allPagesSorted.map((page) => {
		return {
			slug: page.page_slug,
		};
	});
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const page = allPagesSorted.find(
		(page) => page.page_slug === params.slug,
	) as Page;
	const title = page.title;
	const description = page.description || page.body.raw.slice(0, 100);
	return {
		title,
		description,
		metadataBase: new URL(env.HOST),
		openGraph: {
			title,
			description,
			type: "article",
			url: env.HOST,
			images: [
				{
					url: `/og?title=${title}`,
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
