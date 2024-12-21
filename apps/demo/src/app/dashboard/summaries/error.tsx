"use client";

import { Card, CardContent } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";

import { InternalError } from "@/components/internal-error";
import { Meta } from "@/config/metadata";
import { useRouter } from "next/navigation";
import { Button } from "@itell/ui/button";
import { useTransition } from "react";

export default function Page() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.summaries.title}
        text={Meta.summaries.description}
      />
      <Card className="w-full">
        <CardContent className="space-y-4">
          <InternalError className="space-y-2">
            <p>
              Failed to get your summaries at this point, please try again
              later.
            </p>
            <Button
              pending={pending}
              disabled={pending}
              onClick={() => {
                startTransition(() => {
                  router.refresh();
                });
              }}
            >
              Refresh
            </Button>
          </InternalError>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
