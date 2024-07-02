import TextbookNavbar from "@/components/nav/textbook-nav";
import { Fragment } from "react";

export default async function ({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Fragment>
			<TextbookNavbar scroll />
			{children}
		</Fragment>
	);
}
