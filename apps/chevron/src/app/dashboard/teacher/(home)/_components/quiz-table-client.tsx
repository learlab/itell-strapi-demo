"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Page } from "#content";
import { CircleIcon } from "lucide-react";

import { QuizColumns } from "./quiz-table";
import { StudentsTable } from "./students-table";
import { ColumnWithSorting } from "./table-utils";

export function QuizTableClient({
  data,
  quizPages,
}: {
  data: QuizColumns[];
  quizPages: Page[];
}) {
  const columns: ColumnDef<QuizColumns>[] = [
    {
      id: "Name",
      accessorKey: "name",
      header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
    },
    {
      id: "Total",
      accessorKey: "total",
      header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
    },
    ...quizPages.map((page) => ({
      id: page.slug,
      accessorKey: page.slug,
      header: ({ column }: { column: any }) => (
        <ColumnWithSorting
          column={column}
          text={page.title}
          className="h-fit w-full text-wrap"
        />
      ),
      cell: ({ row }: { row: any }) => {
        const count = row.original[page.slug];
        if (count === undefined || count === -1) {
          return (
            <div className="flex items-center justify-center">
              <CircleIcon className="text-muted-foreground" />
            </div>
          );
        }
        return (
          <p>
            {count} / {page.quiz?.length}
          </p>
        );
      },
    })),
  ];

  return (
    <StudentsTable
      columns={columns}
      data={data}
      caption="Showing accuracy ratios (correct/total) for each student in quiz, sorted by total quizzes taken"
      filename="Quiz Stats"
    />
  );
}
