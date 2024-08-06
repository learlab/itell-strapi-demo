import { StatusButton } from "@itell/ui/client";
import { PencilIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useConstructedResponse } from "../provider/page-provider";
import { Spinner } from "../spinner";

export const SubmitButton = ({ chunkSlug }: { chunkSlug: string }) => {
	const { pending } = useFormStatus();
	const currentChunk = useConstructedResponse((state) => state.currentChunk);
	const disabled = pending || currentChunk !== chunkSlug;

	return (
		<StatusButton
			pending={pending}
			type="submit"
			disabled={disabled}
			variant={"outline"}
			className="w-36"
		>
			{pending ? (
				<Spinner className="size-4" />
			) : (
				<>
					<PencilIcon className="size-4 mr-2 shrink-0" />
					<span>Answer</span>
				</>
			)}
		</StatusButton>
	);
};
