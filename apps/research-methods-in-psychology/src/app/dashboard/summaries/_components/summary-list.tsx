"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";

type SummaryData = {
  id: number;
  createdAt: Date;
  isPassed: boolean;
  text: string;
  pageTitle: string;
};

export function SummaryList({ data }: { data: Record<string, SummaryData[]> }) {
  return (
    <ol className="mt-4 divide-y divide-border rounded-md border">
      {Object.entries(data).map(([title, summaries]) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="divide-y divide-border">
              {summaries.map((summary) => (
                <li key={summary.id}>
                  <SummaryItem summary={summary} />
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      ))}
    </ol>
  );
}

interface SummaryItemProps {
  summary: SummaryData;
}

export function SummaryItem({ summary }: SummaryItemProps) {
  return (
    <Link
      href={`/summary/${String(summary.id)}`}
      className="flex flex-col rounded-md px-2 py-4 transition-all duration-150 ease-out hover:bg-accent hover:text-accent-foreground"
      aria-label="user summary"
    >
      <header className="flex flex-col text-sm text-muted-foreground">
        <p>{summary.createdAt.toLocaleDateString()}</p>
      </header>
      <div className="flex items-center justify-between gap-2">
        <p className="line-clamp-2 flex-1">{summary.text}</p>
        {summary.isPassed ? (
          <CheckCircle className="size-4 stroke-info" />
        ) : (
          <XCircle className="size-4 stroke-warning" />
        )}
      </div>
    </Link>
  );
}

export function SummaryItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
