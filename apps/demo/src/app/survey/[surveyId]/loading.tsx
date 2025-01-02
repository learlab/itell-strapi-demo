import { headers } from "next/headers";
import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";
import { Skeleton } from "@itell/ui/skeleton";

import { SurveyHomeShell } from "./shell";
import { SurveySidebar } from "./survey-sidebar";

// workaround to extract surveyId from the URL
// can't access params in loading.tsx https://github.com/vercel/next.js/issues/58179#issuecomment-1813030980
const getSurveyId = async () => {
  const headersList = await headers();
  const url = headersList.get("x-pathname");
  if (!url) {
    return undefined;
  }
  const parts = url.split("/");
  if (!url?.startsWith("/survey") || parts.length < 2) {
    return undefined;
  }

  return parts[1];
};

export default async function Loading() {
  const surveyId = await getSurveyId();
  return (
    <SidebarProvider>
      <SurveySidebar surveyId={surveyId} variant="inset" />
      <SidebarInset>
        <SurveyHomeShell>
          <Skeleton className="h-full w-full" />
        </SurveyHomeShell>
      </SidebarInset>
    </SidebarProvider>
  );
}
