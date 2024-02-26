"use client";

import { Button } from "../client-components";
import { Spinner } from "../spinner";

interface Props extends React.ComponentProps<typeof Button> {
	pending: boolean;
}

export const SummarySubmitButton = ({ disabled, pending, ...rest }: Props) => {
	return (
		<Button disabled={disabled || pending} {...rest} type="submit">
			{pending ? (
				<>
					<Spinner className="mr-2" />
					Submitting...
				</>
			) : (
				"Submit"
			)}
		</Button>
	);
};
