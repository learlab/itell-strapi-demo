import { allPagesSorted } from "@/lib/pages";
import { PageProvider } from "@/components/provider/page-provider";

export const generateStaticParams = async () => {
	return allPagesSorted.map((page) => {
		return {
			slug: page.page_slug,
		};
	});
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const page = allPagesSorted.find((page) => page.page_slug === params.slug);
	if (page) {
		return {
			title: page.title,
			description: page.body.raw.slice(0, 100),
		};
	}
};

export default async function ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { slug: string };
}) {
	return <PageProvider pageSlug={params.slug}>{children}</PageProvider>;
}
