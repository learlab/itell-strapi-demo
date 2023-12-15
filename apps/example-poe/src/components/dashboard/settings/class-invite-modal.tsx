"use client";

import { Spinner } from "@/components/spinner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { updateUserWithClassId } from "@/lib/server-actions";
import { Button } from "@itell/ui/client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	user: User;
	teacherToJoin: User | null;
	classId: string;
};

export const ClassInviteModal = ({ user, teacherToJoin, classId }: Props) => {
	const [open, setOpen] = useState(true);
	const router = useRouter();
	const [joinClassLoading, setJoinClassLoading] = useState(false);
	const canJoinClass = !user.classId && teacherToJoin;

	const joinClass = async () => {
		setJoinClassLoading(true);
		await updateUserWithClassId({ userId: user.id, classId });
		setJoinClassLoading(false);

		toast.success("You have joined the class! Redirecting.");
		setTimeout(() => {
			router.push("/dashboard");
		}, 1000);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Join a class</DialogTitle>
					<DialogDescription>
						{user.classId ? (
							<p>
								It looks like you are trying to join a class, but you have
								already been in one. Contact lear.lab.vu@gmail.com if you
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
								<span className="font-semibold">{classId}</span> is not a valid
								class code. Make sure you enter the correct invitation link from
								your teacher.
							</p>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					{canJoinClass && (
						<Button
							onClick={joinClass}
							variant="secondary"
							disabled={joinClassLoading}
						>
							{joinClassLoading && <Spinner className="mr-2 inline" />}
							Confirm
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
