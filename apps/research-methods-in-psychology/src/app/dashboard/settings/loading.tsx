import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { Separator } from "@itell/ui/separator";
import { Skeleton } from "@itell/ui/skeleton";
import { Profile } from "@settings/profile";

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.settings.title}
        text={Meta.settings.description}
      />
      <Card>
        <CardHeader className="gap-2">
          <CardTitle>Edit your settings</CardTitle>
          <CardDescription>configure the textbook to your need</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Profile.Skeleton />
          <Separator />
          <h3 className="mb-4 text-lg font-semibold leading-relaxed">
            Website Settings
          </h3>
          <Skeleton className="h-8 w-[120px]" />
          <Skeleton className="h-24 w-[400px]" />
          <Skeleton className="h-8 w-[40px]" />
          <Separator />
          <h3 className="mb-4 text-lg font-semibold leading-relaxed">
            Class Information
          </h3>
          <Skeleton className="h-8 w-[400px]" />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
