import { getQuizAttemptsByClass } from "@/actions/event";
import { CreateErrorFallback } from "@/components/error-fallback";
import { quizPages } from "@/lib/pages/pages.server";
import { Skeleton } from "@itell/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@itell/ui/table";
import { groupBy } from "es-toolkit";
import { CheckCircleIcon, CircleIcon } from "lucide-react";

type Props = {
  students: { name: string; id: string }[];
};

export async function ClassQuizList({ students }: Props) {
  const [data, err] = await getQuizAttemptsByClass({
    ids: students.map((s) => s.id),
  });
  if (err) {
    throw new Error("failed to get quiz statistics", { cause: err });
  }

  const quizRecords = groupBy(data, (item) => item.userId);

  const studentsWithQuiz = students.map((s) => {
    const records = quizRecords[s.id];
    const quizStatus = Object.fromEntries(
      quizPages.map((p) => [
        p.slug,
        records && records.map((r) => r.pageSlug).includes(p.slug)
          ? true
          : false,
      ])
    );
    const total = records?.length ?? 0;
    return {
      id: s.id,
      name: s.name,
      total,
      quizStatus,
    };
  });

  return (
    <Table>
      <TableHeader>
        <TableHead className="w-40" />
        <TableHead className="w-20">Total</TableHead>
        {quizPages.map((page) => (
          <TableHead key={page.slug}>{page.title}</TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {studentsWithQuiz.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-semibold">{student.name}</TableCell>
            <TableCell className="font-semibold">{student.total}</TableCell>
            {quizPages.map((page) => (
              <TableCell key={page.slug}>
                {student.quizStatus[page.slug] ? (
                  <CheckCircleIcon className="text-success" />
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

ClassQuizList.Skeleton = function () {
  return <Skeleton className="h-80 w-full" />;
};

ClassQuizList.ErrorFallback = CreateErrorFallback(
  "Failed to get quiz statistics"
);
