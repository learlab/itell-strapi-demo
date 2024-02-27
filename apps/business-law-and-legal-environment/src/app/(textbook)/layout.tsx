import TextbookNavbar from "@/components/nav/textbook-nav";
import { Fragment } from "react";

export default async function ({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Fragment>
			<TextbookNavbar />
			<div className="max-w-screen-2xl p-4 lg:p-8">{children}</div>
		</Fragment>
	);
}
