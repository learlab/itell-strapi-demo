"use client";

import { useEffect, useState } from "react";

import { updateUserAction } from "@/actions/user";
import { InternalError } from "@/components/internal-error";
import { reportSentry } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@itell/ui/alert-dialog";
import { Button } from "@itell/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

type Props = {
  userClassId: string | null;
  teacherName: string | null;
  classId: string;
};

export function JoinClassModal({
  userClassId,
  teacherName,
  classId,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { isPending, execute, isError, error } =
    useServerAction(updateUserAction);
  const canJoinClass = !userClassId && teacherName;

  const joinClass = async () => {
    const [_, err] = await execute({ classId });
    if (!err) {
      setOpen(false);
      toast.success("You have joined the class! Redirecting.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error("Can't join class now, please try again later.");
      reportSentry("join class", { error });
    }
  }, [isError]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Join a class</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">
                {userClassId ? (
                  <p>
                    It looks like you are trying to join a class with class code{" "}
                    <span className="font-semibold">{classId}</span>, but you
                    are already in a class. Contact lear.lab.vu@gmail.com if you
                    believe this is a mistake.
                  </p>
                ) : teacherName ? (
                  <p>
                    You are about to join a class taught by{" "}
                    <span className="font-semibold">{teacherName}</span>. Click
                    the confirm button to join.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No teacher found associated with the code, please make sure
                    you are using the exact code received from your teacher.
                  </p>
                )}
              </div>

              {isError ? <InternalError /> : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          {canJoinClass ? <Button
              onClick={joinClass}
              disabled={isPending}
              pending={isPending}
              className="bg-primary focus:ring-primary"
            >
              Confirm
            </Button> : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
