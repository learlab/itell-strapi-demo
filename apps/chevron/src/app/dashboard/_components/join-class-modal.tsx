"use client";

import { updateUserAction } from "@/actions/user";
import { InternalError } from "@/components/interval-error";
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
} from "@itell/ui/client";
import { User } from "lucia";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

type Props = {
	userClassId: string | null;
	teacher: User;
	classId: string;
};

export const JoinClassModal = ({
	userClassId,
	teacher: teacherToJoin,
	classId,
}: Props) => {
	const router = useRouter();
	const [open, setOpen] = useState(true);
	const { isPending, execute, isError, error } =
		useServerAction(updateUserAction);
	const canJoinClass = !userClassId && teacherToJoin;

	const joinClass = async () => {
		const [_, err] = await execute({ classId });
		if (!err) {
			setOpen(false);
			toast.success("You have joined the class! Redirecting.");
			setTimeout(() => {
				router.push("/dashboard");
			}, 1000);
		}
	};
	console.log(error);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Join a class</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div className="grid gap-2">
							<div className="text-muted-foreground text-sm">
								{userClassId ? (
									<p>
										It looks like you are trying to join a class with class code{" "}
										<span className="font-semibold">{classId}</span>, but you
										are already in a class. Contact lear.lab.vu@gmail.com if you
										believe this is a mistake.
									</p>
								) : teacherToJoin ? (
									<p>
										You are about to join a class taught by{" "}
										<span className="font-semibold">{teacherToJoin.name}</span>.
										Click the confirm button to join.
									</p>
								) : (
									<p>
										It looks like you are trying to enroll in a class, But{" "}
										<span className="font-semibold">{classId}</span> is not a
										valid class code. Make sure you enter the correct invitation
										link from your teacher.
									</p>
								)}
							</div>

							{isError && <InternalError />}
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
					{canJoinClass && (
						<Button
							onClick={joinClass}
							disabled={isPending}
							className="bg-primary focus:ring-primary"
						>
							<span className="flex items-center gap-2">
								{isPending && <Spinner />}
								Confirm
							</span>
						</Button>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
