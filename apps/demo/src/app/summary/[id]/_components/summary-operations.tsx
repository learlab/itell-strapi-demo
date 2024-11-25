"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@itell/ui/dropdown";
import { CircleEllipsisIcon } from "lucide-react";

type Props = {
  pageHref: string;
};

export function SummaryOperations({ pageHref }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <CircleEllipsisIcon className="size-4" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex cursor-pointer items-center">
          <Link href={pageHref}>Go to page</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
