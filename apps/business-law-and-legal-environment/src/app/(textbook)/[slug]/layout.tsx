import { allPagesSorted } from "@/lib/pages";

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
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
