import { Skeleton } from "@itell/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@itell/ui/table";
import { CircleIcon } from "lucide-react";

import { analyzeClassQuizAction } from "@/actions/quiz";
import { CreateErrorFallback } from "@/components/error-fallback";
import { quizPages } from "@/lib/pages/pages.server";

type Props = {
  classId: string;
  students: { name: string; id: string }[];
};

export async function ClassQuizTable({ students, classId }: Props) {
  const [data, err] = await analyzeClassQuizAction({
    studentIds: students.map((s) => s.id),
    classId,
  });
  if (err) {
    throw new Error("failed to get class quiz stats", { cause: err });
  }

  // loop through students instead of data to show all students in the table
  // for each student, generate the object {page1: correctCount, page2: correctCount, ...}
  const byStudent = students.reduce<Record<string, Record<string, number>>>(
    (acc, cur) => {
      const entries = data.filter((d) => d.userId === cur.id);

      if (entries.length === 0) {
        acc[cur.name] = {};
        return acc;
      }
      const name = entries[0].name;

      if (!acc[name]) {
        acc[name] = {};
      }

      for (const entry of entries) {
        acc[name][entry.pageSlug] = entry.count;
      }

      return acc;
    },
    {}
  );
  const studentsArr = Object.entries(byStudent);
  studentsArr.sort(
    (a, b) => Object.keys(b[1]).length - Object.keys(a[1]).length
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-40" />
          <TableHead className="w-20">Total</TableHead>
          {quizPages.map((page) => (
            <TableHead key={page.slug}>{page.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {studentsArr.map(([name, records]) => (
          <TableRow key={name}>
            <TableCell className="font-semibold">{name}</TableCell>
            <TableCell className="font-semibold">
              {Object.keys(records).length}
            </TableCell>
            {quizPages.map((page) => (
              <TableCell key={page.slug}>
                {records[page.slug] !== undefined ? (
                  <span>
                    {records[page.slug]} / {page.quiz?.length}
                  </span>
                ) : (
                  <CircleIcon className="text-muted-foreground" />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

ClassQuizTable.Skeleton = function () {
  return <Skeleton className="h-80 w-full" />;
};

ClassQuizTable.ErrorFallback = CreateErrorFallback(
  "Failed to get quiz statistics"
);
