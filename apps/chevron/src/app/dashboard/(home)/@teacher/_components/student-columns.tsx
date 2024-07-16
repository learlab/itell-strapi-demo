"use client";

import { User } from "@/drizzle/schema";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@itell/ui/client";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LinkIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudentData = Pick<User, "id" | "email" | "name" | "createdAt"> & {
	progress: { index: number; text: string };
	summaryCounts: number;
};

const ColumnWithSorting = ({
	column,
	text,
}: { column: Column<StudentData, unknown>; text: string }) => {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			className="pl-0"
		>
			{text}
			<ArrowUpDown className="ml-2 size-4" />
		</Button>
	);
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
					className="flex gap-1 items-center hover:underline"
				>
					<LinkIcon className="w-2 h-2" />
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
			return `${progress.text}`;
		},
	},
	{
		id: "Total Summaries",
		accessorKey: "summaryCounts",
		header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
	},
	{
		id: "Joined Date",
		accessorKey: "createdAt",
		header: ({ column }) => ColumnWithSorting({ column, text: column.id }),

		sortingFn: (rowA, rowB, columnId) => {
			return rowA.original.createdAt > rowB.original.createdAt ? 1 : -1;
		},
		cell: ({ row }) => {
			return row.original.createdAt.toLocaleDateString("en-us");
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
