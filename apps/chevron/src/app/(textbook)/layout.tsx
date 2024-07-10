import { TextbookNav } from "@/components/textbook-nav";
import { Fragment } from "react";

export default async function ({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Fragment>
			<TextbookNav scroll />
			{children}
		</Fragment>
	);
}
