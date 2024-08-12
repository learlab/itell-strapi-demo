import { TextbookNav } from "@/components/textbook-nav";
import { Fragment } from "react";

export default function ({ children }: { children: React.ReactNode }) {
	return (
		<Fragment>
			<TextbookNav />
			{children}
		</Fragment>
	);
}
