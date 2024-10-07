"use client";

import { useEffect, useState } from "react";

import { useIsMobile } from "@itell/core/hooks";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@itell/ui/alert-dialog";

export function MobilePopup() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isMobile) {
      setOpen(true);
    }
  }, [isMobile]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mobile Device Detected</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">
                This textbook is not optimized for mobile devices. Please use a
                desktop or laptop to access the full functionality of the
                textbook.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
