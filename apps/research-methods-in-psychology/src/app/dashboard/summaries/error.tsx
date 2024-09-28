"use client";

import { InternalError } from "@/components/internal-error";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { Card, CardContent } from "@itell/ui/card";

export default function () {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.summaries.title}
        text={Meta.summaries.description}
      />
      <Card className="w-full">
        <CardContent className="space-y-4">
          <InternalError>
            Failed to get your summaries at this point, please try again later.
          </InternalError>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
