import { StatusButton } from "@itell/ui/status-button";
import { PencilIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export const SubmitButton = ({ chunkSlug }: { chunkSlug: string }) => {
	const { pending } = useFormStatus();

	return (
		<StatusButton
			pending={pending}
			type="submit"
			disabled={pending}
			variant={"outline"}
		>
			<span className="inline-flex items-center justify-center gap-2">
				<PencilIcon className="size-4 mr-2 shrink-0" />

				<span>Answer</span>
			</span>
		</StatusButton>
	);
};
