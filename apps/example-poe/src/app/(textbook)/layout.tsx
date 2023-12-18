// @ts-nocheck
import TextbookNavbar from "@/components/nav/textbook-nav";
import { PageProvider } from "@/components/provider/page-provider";
import "@/styles/prism-one-dark.css";

export const dynamic = "force-dynamic";

export default async function ({
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
