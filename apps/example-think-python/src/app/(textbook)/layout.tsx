import TextbookNavbar from "@/components/nav/textbook-nav";
import { PageProvider } from "@/components/provider/page-provider";
import "@/styles/prism-one-dark.css";
export default async function SectionLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<PageProvider>
			<TextbookNavbar dashboardLink={true} />
			<div className="max-w-screen-2xl mx-auto p-8 lg:p-12">{children}</div>
		</PageProvider>
	);
}
