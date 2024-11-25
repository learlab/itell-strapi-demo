"use client";

import { Card, CardContent } from "@itell/ui/card";

import { InternalError } from "@/components/internal-error";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "../_components/shell";

export default function () {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.settings.title}
        text={Meta.settings.description}
      />
      <Card>
        <CardContent>
          <InternalError />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
