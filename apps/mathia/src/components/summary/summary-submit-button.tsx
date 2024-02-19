"use client";

import { useFormStatus } from "react-dom";
import { Button, Link } from "../client-components";
import { useSession } from "next-auth/react";
import { Spinner } from "../spinner";

interface Props extends React.ComponentProps<typeof Button> {}

export const SummarySubmitButton = ({ disabled, ...rest }: Props) => {
	const { data: session } = useSession();
	const { pending } = useFormStatus();
	return (
		<Button disabled={disabled || pending} {...rest}>
			{pending && <Spinner className="mr-2" />}
			{session?.user ? (
				pending ? (
					"Submitting"
				) : (
					"Submit"
				)
			) : (
				<Link href="/auth">Log in to create a summary</Link>
			)}
		</Button>
	);
};
