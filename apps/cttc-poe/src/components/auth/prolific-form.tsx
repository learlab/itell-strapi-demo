"use client";

import { env } from "@/env.mjs";
import { useSafeSearchParams } from "@/lib/navigation";
import { Input } from "@itell/ui/server";
import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";
import { Button, Label } from "../client-components";

export const ProlificForm = () => {
	const { prolific_pid } = useSafeSearchParams("auth");
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const pid = formData.get("pid") as string;

		startTransition(() => {
			router.push(`/auth/prolific?prolific_id=${pid}`);
		});
	};

	return (
		<form
			className="grid w-full max-w-sm items-center gap-2"
			onSubmit={onSubmit}
		>
			<Label htmlFor="pid">Prolific ID</Label>
			<Input
				type="text"
				name="pid"
				id="pid"
				placeholder="Enter your Prolific ID here"
				defaultValue={prolific_pid}
			/>
			<Button disabled={pending} variant={"outline"}>
				{pending ? "Confirming..." : "Confirm"}
			</Button>
		</form>
	);
};
