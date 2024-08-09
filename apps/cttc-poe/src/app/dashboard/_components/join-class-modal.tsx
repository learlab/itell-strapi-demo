"use client";

import { Spinner } from "@/components/spinner";
import { User } from "@/drizzle/schema";
import { updateUser } from "@/lib/user/actions";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	userId: string;
	userClassId: string | null;
	teacher: User;
	classId: string;
};

export const JoinClassModal = ({
	userId,
	userClassId,
	teacher: teacherToJoin,
	classId,
}: Props) => {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();
	const [joinClassLoading, setJoinClassLoading] = useState(false);
	const canJoinClass = !userClassId && teacherToJoin;

	const joinClass = async () => {
		setJoinClassLoading(true);
		await updateUser(userId, { classId });

		setJoinClassLoading(false);

		toast.success("You have joined the class! Redirecting.");
		setTimeout(() => {
			router.push("/dashboard");
		}, 1000);
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Join a class</AlertDialogTitle>
					<AlertDialogDescription asChild>
						{userClassId ? (
							<p>
								It looks like you are trying to join a class with class code{" "}
								<span className="font-semibold">{classId}</span>, but you are
								already in a class. Contact lear.lab.vu@gmail.com if you believe
								this is a mistake.
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
								<span className="font-semibold">{classId}</span> is not a valid
								class code. Make sure you enter the correct invitation link from
								your teacher.
							</p>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
					{canJoinClass && (
						<Button
							onClick={joinClass}
							disabled={joinClassLoading}
							pending={joinClassLoading}
						>
							Confirm
						</Button>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
