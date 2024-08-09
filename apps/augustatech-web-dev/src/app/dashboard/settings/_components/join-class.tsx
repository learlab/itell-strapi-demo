"use client";

import { getTeacherByClassAction } from "@/actions/dashboard";
import { InternalError } from "@/components/interval-error";
import { useSafeSearchParams } from "@/lib/navigation";
import { JoinClassModal } from "@dashboard/join-class-modal";
import { Button } from "@itell/ui/client";
import { Input } from "@itell/ui/server";
import { User } from "lucia";
import { useState } from "react";
import { useServerAction } from "zsa-react";

type Props = {
	user: User;
};

export const JoinClassForm = ({ user }: Props) => {
	const { join_class_code } = useSafeSearchParams("settings");
	const { execute, isPending, isError } = useServerAction(
		getTeacherByClassAction,
	);
	const [teacherName, setTeacherName] = useState<string | null | undefined>(
		undefined,
	);
	const [classId, setClassId] = useState<string>(join_class_code || "");

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const code = String(formData.get("code"));

		const [teacher, err] = await execute({
			classId: code,
		});
		if (!err) {
			if (teacher) {
				setTeacherName(teacher.name);
				setClassId(code);
			} else {
				setTeacherName(null);
			}
		}
	};

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground text-sm">
				If you are enrolled in a class that uses this textbook, you can ask your
				teacher for a class code to enter it here. This will allow you to
				receive class-based feedback.
			</p>
			<h2 className="sr-only" id="form-class-heading">
				Join a class
			</h2>
			<form
				aria-labelledby="form-class-heading"
				className="grid gap-2 justify-items-start"
				onSubmit={onSubmit}
			>
				<Input
					name="code"
					placeholder="Enter your class code here"
					type="text"
					required
					defaultValue={join_class_code || ""}
				/>
				{isError && <InternalError />}
				<Button disabled={isPending} type="submit" pending={isPending}>
					Submit
				</Button>
			</form>
			{/* dialog to confirm joining a class */}
			{teacherName && (
				<JoinClassModal
					userClassId={user.classId}
					teacherName={teacherName}
					classId={classId}
				/>
			)}
			{teacherName === null && (
				<p className="text-sm text-muted-foreground">
					No teacher found associated with the code, please make sure you are
					using the exact code received from your teacher.
				</p>
			)}
			{isError && <InternalError />}
		</div>
	);
};
