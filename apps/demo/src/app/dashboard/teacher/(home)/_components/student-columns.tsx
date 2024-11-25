"use client";

import Link from "next/link";
import { Button } from "@itell/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@itell/ui/dropdown";
import { type ColumnDef } from "@tanstack/react-table";
import { LinkIcon, MoreHorizontal } from "lucide-react";

import { type User } from "@/drizzle/schema";
import { ColumnWithSorting } from "./table-utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudentData = Pick<User, "id" | "email" | "name" | "createdAt"> & {
  progress: string;
  pageIndex: number;
  pageTitle: string;
  summaryCount: number;
};

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
    sortingFn: (rowA, rowB) => {
      return rowA.original.pageIndex > rowB.original.pageIndex ? 1 : -1;
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
