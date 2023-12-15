"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
} from "@/components/client-components";
import { Errorbox, Input } from "@itell/ui/server";
import { useRouter } from "next/navigation";
import {
	getTeacherWithClassId,
	updateUserWithClassId,
} from "@/lib/server-actions";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";

type FormState =
	| { data: null; error: null }
	| { data: { teacherName: string }; error: null }
	| { data: null; error: string };

const onSubmit = async (
	prevState: FormState,
	formData: FormData,
): Promise<FormState> => {
	const classId = formData.get("code") as string;
	const teacher = await getTeacherWithClassId(classId);
	if (!teacher) {
		return { data: null, error: "Invalid class code" };
	}

	return {
		data: {
			teacherName: teacher.name as string,
		},
		error: null,
	};
};

export const JoinClassForm = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const [joinClassModalOpen, setJoinClassModalOpen] = useState(false);

	// @ts-ignore
	const [formState, formAction] = useFormState<FormState>(onSubmit, {
		data: null,
		error: null,
	});
	const [code, setCode] = useState("");

	const [joinClassLoading, setJoinClassLoading] = useState(false);

	useEffect(() => {
		if (formState.data?.teacherName) {
			setJoinClassModalOpen(true);
		}
	}, [formState]);

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
					onChange={(e) => setCode(e.currentTarget.value)}
				/>
				<Button type="submit">Submit</Button>
			</form>
			{/* dialog to confirm joining a class */}
			<AlertDialog
				open={joinClassModalOpen}
				onOpenChange={(val) => setJoinClassModalOpen(val)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Join a Class</AlertDialogTitle>
						<AlertDialogDescription>
							You are about to join a class taught by{" "}
							{formState.data?.teacherName}. Your learning data will be shared
							with your teacher.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={joinClassLoading}
							className="bg-primary"
							onClick={async (e) => {
								e.preventDefault();
								setJoinClassLoading(true);

								if (session?.user) {
									await updateUserWithClassId({
										userId: session.user.id,
										classId: code,
									});

									setJoinClassLoading(false);
									setJoinClassModalOpen(false);
									toast.success(
										"You are now added to class. Go to the statistics page on the sidebar to check your progress.",
									);

									router.refresh();
								}
							}}
						>
							{joinClassLoading ? <Spinner /> : " Continue"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
