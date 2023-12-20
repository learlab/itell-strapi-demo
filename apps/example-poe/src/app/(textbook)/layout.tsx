import TextbookNavbar from "@/components/nav/textbook-nav";
import { PageProvider } from "@/components/provider/page-provider";
import { Fragment } from "react";

export default async function ({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Fragment>
			<TextbookNavbar />
			<div className="max-w-screen-2xl mx-auto p-4 lg:p-8">{children}</div>
		</Fragment>
	);
}
