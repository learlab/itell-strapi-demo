"use client";

import { cn } from "@itell/core/utils";
import { CornerDownLeft } from "lucide-react";
import { HTMLAttributes } from "react";
import { useFormState } from "react-dom";
import TextArea from "react-textarea-autosize";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

type FormState = {
	input: string;
	error: string | null;
};

const onSubmit = async (prevState: FormState, formData: FormData) => {
	const input = formData.get("input") as string;
	return { input, error: null };
};

const initialState: FormState = {
	input: "",
	error: null,
};

export const ChatInput = ({ className, ...props }: ChatInputProps) => {
	const [formState, formAction] = useFormState(onSubmit, initialState);
	return (
		<div {...props} className={cn("px-2", className)}>
			<form
				action={formAction}
				className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none"
			>
				<TextArea
					name="input"
					rows={2}
					maxRows={4}
					autoFocus
					placeholder="Write a message..."
					className="disabled:opacity-50 bg-background/90 rounded-md border border-border pr-14 resize-none block w-full  px-4 py-1.5 focus:ring-0 text-sm sm:leading-6"
				/>

				<div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
					<button type="submit">
						<kbd className="inline-flex items-center rounded border px-1 text-xs">
							<CornerDownLeft className="w-3 h-3" />
						</kbd>
					</button>
				</div>

				<div
					className="absolute inset-x-0 bottom-0 border-t border-border"
					aria-hidden="true"
				/>
			</form>
		</div>
	);
};
