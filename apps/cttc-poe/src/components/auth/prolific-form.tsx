"use client";

import { useSafeSearchParams } from "@/lib/navigation";
import { Input } from "@itell/ui/server";
import { signIn } from "next-auth/react";
import { useFormState, useFormStatus } from "react-dom";
import { Button, Label } from "../client-components";

const ConfirmButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button disabled={pending} variant={"outline"}>
			{pending ? "Confirming..." : "Confirm"}
		</Button>
	);
};

type FormState = {
	error: string | null;
};

const initialState: FormState = { error: null };

export const ProlificForm = () => {
	const { prolific_pid } = useSafeSearchParams("auth");
	const [formState, formAction] = useFormState(
		async (prevState: FormState, formData: FormData) => {
			const pid = String(formData.get("pid"));
			await signIn(
				"credentials",
				{ callbackUrl: "/", isCredentials: true },
				{
					pid,
				},
			);
			return { error: null };
		},
		initialState,
	);

	return (
		<form
			className="grid w-full max-w-sm items-center gap-2"
			action={formAction}
		>
			<Label htmlFor="pid">Prolific ID</Label>
			<Input
				type="text"
				name="pid"
				id="pid"
				placeholder="Enter your Prolific ID here"
				defaultValue={prolific_pid}
			/>
			<ConfirmButton />
		</form>
	);
};
