"use client";

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/client-components";
import { QuizRecord } from "@/components/quiz/quiz-record";
import { AnswerData, QuizData } from "@/lib/quiz";
import { makePageHref } from "@/lib/utils";
import { User } from "@prisma/client";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LinkIcon } from "lucide-react";
import Link from "next/link";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type QuizTableData = Pick<User, "id" | "name"> & {
	quizTitle: string;
	quizPageSlug: string;
	quizAnswers: AnswerData;
	accuracy: number;

	created_at: Date;
};

const ColumnWithSorting = ({
	column,
	text,
}: { column: Column<QuizTableData, unknown>; text: string }) => {
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

export const columns: ColumnDef<QuizTableData>[] = [
	{
		id: "Name",
		accessorKey: "name",
		header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
		cell: ({ row }) => {
			return (
				<Link
					href={`/dashboard/student/${row.original.id}`}
					className="flex justify-center gap-1 items-center hover:underline"
				>
					<LinkIcon className="w-2 h-2" />
					{row.original.name}
				</Link>
			);
		},
	},

	{
		id: "Quiz",
		accessorKey: "quizTitle",
		header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
		cell: ({ row }) => {
			return (
				<Dialog>
					<DialogTrigger>{row.original.quizTitle}</DialogTrigger>
					<DialogContent className="sm:max-w-2xl h-4/5 overflow-y-scroll">
						<DialogHeader>
							<DialogTitle>{row.original.name}'s quiz choices</DialogTitle>
						</DialogHeader>
						<QuizRecord
							pageSlug={row.original.quizPageSlug}
							answerData={row.original.quizAnswers}
						/>
					</DialogContent>
				</Dialog>
			);
		},
	},
	{
		id: "Accuracy",
		accessorKey: "accuracy",
		header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
		cell: ({ row }) => `${row.original.accuracy.toFixed(2)}%`,
	},
	{
		id: "Date",
		accessorKey: "created_at",
		header: ({ column }) => ColumnWithSorting({ column, text: column.id }),

		sortingFn: (rowA, rowB, columnId) => {
			return rowA.original.created_at > rowB.original.created_at ? 1 : -1;
		},
		cell: ({ row }) => {
			return row.original.created_at.toLocaleDateString("en-us");
		},
	},
];
