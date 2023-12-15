"use client";

import { useState } from "react";
import { Errorbox, Input, buttonVariants } from "@itell/ui/server";
import { useSearchParams } from "next/navigation";
import { getTeacherWithClassId } from "@/lib/server-actions";
import { useFormState, useFormStatus } from "react-dom";
import { User } from "@prisma/client";
import { ClassInviteModal } from "./class-invite-modal";
import { Button } from "@itell/ui/client";
import { Spinner } from "@/components/spinner";

type Props = {
	user: User;
};

type FormState =
	| { teacher: User; error: null }
	| { teacher: null; error: string }
	| { teacher: null; error: null };

const onSubmit = async (
	prevState: FormState,
	formData: FormData,
): Promise<FormState> => {
	const classId = formData.get("code") as string;
	const teacher = await getTeacherWithClassId(classId);
	if (!teacher) {
		return { teacher: null, error: "Invalid class code" };
	}

	return {
		teacher,
		error: null,
	};
};

export const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending}>
			{pending && <Spinner className="inline-flex mr-2" />}Submit
		</Button>
	);
};

export const JoinClassForm = ({ user }: Props) => {
	const searchParams = useSearchParams();
	const classIdToJoin = searchParams?.get("join_class_code");

	const [formState, formAction] = useFormState(onSubmit, {
		teacher: null,
		error: null,
	});

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground text-sm">
				If you are enrolled in a class that uses this textbook, you can ask your
				teacher for a class code to enter it here. This will allow you to
				receive class-based feedback.
			</p>
			<form action={formAction} className="space-y-2">
				{formState.error && (
					<Errorbox title="Error">{formState.error}</Errorbox>
				)}
				<Input
					name="code"
					placeholder="Enter your class code here"
					type="text"
					required
					defaultValue={classIdToJoin || ""}
				/>
				<SubmitButton />
			</form>
			{/* dialog to confirm joining a class */}
			{formState.teacher && (
				<ClassInviteModal
					user={user}
					teacherToJoin={formState.teacher}
					classId={classIdToJoin as string}
				/>
			)}
		</div>
	);
};
