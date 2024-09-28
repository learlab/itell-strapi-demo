"use client";

import { type User } from "@/drizzle/schema";
import { Button } from "@itell/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@itell/ui/dropdown";
import { type Column, type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LinkIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudentData = Pick<User, "id" | "email" | "name" | "createdAt"> & {
  progress: { index: number; text: string };
  summaryCount: number;
};

function ColumnWithSorting({
  column,
  text,
}: {
  column: Column<StudentData>;
  text: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
      className="px-1"
    >
      <span className="flex items-center gap-2">
        <ArrowUpDown className="size-4" />
        {text}
      </span>
    </Button>
  );
}

export const columns: ColumnDef<StudentData>[] = [
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
    cell: (props) => {
      return (
        <Link
          href={`/dashboard/student/${props.row.original.id}`}
          className="flex items-center gap-1 hover:underline"
        >
          <LinkIcon className="h-2 w-2" />
          {props.cell.getValue() as string}
        </Link>
      );
    },
  },
  {
    id: "Email",
    accessorKey: "email",
    header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
  },
  {
    id: "Progress",
    accessorKey: "progress",
    header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
    sortingFn: (rowA, rowB, columnId) => {
      return rowA.original.progress.index > rowB.original.progress.index
        ? 1
        : -1;
    },
    cell: ({ row }) => {
      const progress = row.original.progress;
      return progress.text;
    },
  },
  {
    id: "Total Summaries",
    accessorKey: "summaryCount",
    header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
  },
  {
    id: "Joined Date",
    accessorKey: "createdAt",
    header: ({ column }) => ColumnWithSorting({ column, text: column.id }),

    sortingFn: (rowA, rowB) => {
      return rowA.original.createdAt > rowB.original.createdAt ? 1 : -1;
    },
    cell: ({ row }) => {
      return row.original.createdAt.toLocaleDateString();
    },
  },
  {
    id: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/student/${row.original.id}`}>
                View student details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
