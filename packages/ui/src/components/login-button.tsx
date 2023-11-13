import { useState } from "react";
import { Spinner } from "./spinner";
import { Button } from "./button";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
	action: () => Promise<any>;
	title: string;
	icon: React.ReactNode;
}

export const CreateLoginButton = ({ action, icon, title, ...rest }: Props) => {
	return () => {
		const [isPending, setIsPending] = useState(false);
		return (
			<Button
				variant={"outline"}
				onClick={async () => {
					setIsPending(true);
					await action();
					setIsPending(false);
				}}
				disabled={isPending}
				{...rest}
			>
				{isPending ? <Spinner className="mr-2" /> : icon}
				{title}
			</Button>
		);
	};
};
