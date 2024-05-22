import { PencilIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../client-components";
import { Spinner } from "../spinner";

export const SubmitButton = ({ answered }: { answered: boolean }) => {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			disabled={pending}
			className="gap-2"
			variant={"outline"}
		>
			{pending ? (
				<Spinner className="size-4" />
			) : (
				<PencilIcon className="size-4" />
			)}
			{answered ? "Resubmit" : "Answer"}
		</Button>
	);
};
