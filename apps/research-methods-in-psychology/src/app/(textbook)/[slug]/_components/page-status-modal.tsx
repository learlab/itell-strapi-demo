"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@itell/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@itell/ui/dialog";
import { type User } from "lucia";

import { isProduction } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { makePageHref } from "@/lib/utils";
import { LoginButton } from "@auth//auth-form";

type Props = {
  user: User | null;
  pageStatus: PageStatus;
};

export function PageStatusModal({ user, pageStatus }: Props) {
  const { latest, unlocked } = pageStatus;
  if (unlocked) {
    return null;
  }

  if (user) {
    if (latest) {
      return null;
    }

    const href = makePageHref(user.pageSlug);

    // user with locked page
    return (
      <Modal title="You haven't unlocked this page yet">
        <div>
          Submit a passing summary for
          <Link href={href} className="mx-1 font-semibold underline">
            <span> this page </span>
          </Link>
          first.
        </div>
        <DialogFooter>
          <Button>
            <Link href={href}>Go to page</Link>
          </Button>
        </DialogFooter>
      </Modal>
    );
  }

  // no user, and page is locked
  return (
    <Modal
      title="Log in to access the textbook"
      description="We collects anonymous data to improve learning experience."
    >
      <div className="flex justify-center">
        <LoginButton />
      </div>
    </Modal>
  );
}

function Modal({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isProduction) {
          setOpen(false);
        }
      }}
    >
      <DialogContent canClose={!isProduction}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
