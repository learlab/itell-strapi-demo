import TextbookNavbar from "@/components/nav/textbook-nav";
import { PageProvider } from "@/components/provider/page-provider";

export default async function SectionLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<PageProvider>
			<TextbookNavbar />
			<div className="max-w-screen-2xl mx-auto p-4 lg:p-8">{children}</div>
		</PageProvider>
	);
}
