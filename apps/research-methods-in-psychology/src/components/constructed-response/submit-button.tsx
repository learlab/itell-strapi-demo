import { PencilIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { StatusButton } from "../client-components";
import { Spinner } from "../spinner";

export const SubmitButton = ({ answered }: { answered: boolean }) => {
	const { pending } = useFormStatus();
	return (
		<StatusButton
			pending={pending}
			type="submit"
			disabled={pending}
			variant={"outline"}
		>
			{pending ? (
				<Spinner className="size-4" />
			) : (
				<>
					<PencilIcon className="size-4 mr-2 shrink-0" />
					<span>{answered ? "Resubmit" : "Answer"}</span>
				</>
			)}
		</StatusButton>
	);
};
