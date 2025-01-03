import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@itell/ui/alert-dialog";
import { Button } from "@itell/ui/button";
import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";
import { User } from "lucia";

import { deleteSurveyAction, getSurveyAction } from "@/actions/survey";
import { ContinueReading } from "@/components/continue-reading";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { SurveyHomeShell } from "./shell";
import { SurveySidebar } from "./survey-sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<unknown>;
}) {
  const { surveyId } = routes.surveyHome.$parseParams(await params);
  const { user } = await getSession();

  if (!user) {
    return redirectWithSearchParams("/auth", {
      redirect_to: routes.surveyHome({ surveyId }),
    });
  }

  const [session] = await getSurveyAction({ surveyId });
  if (session && session.finishedAt !== null) {
    return (
      <SidebarProvider>
        <SurveySidebar
          variant="inset"
          surveyId={surveyId}
          surveySession={session ?? undefined}
        />
        <SidebarInset>
          <SurveyHomeShell user={user}>
            <p className="text-lg font-medium">
              Thank you for completing the survey. You can now go to the
              textbook
            </p>
            <div className="flex items-center gap-2">
              <ContinueReading user={user} />
              {isAdmin(user.role) && <DeleteSurvey surveyId={surveyId} />}
            </div>
          </SurveyHomeShell>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return children;
}

function DeleteSurvey({ surveyId }: { surveyId: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete Survey Record</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete previous survey record?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete your previous survey submission and allow you to
            re-take the survey. This is for admin testing only.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              "use server";
              await deleteSurveyAction({ surveyId });

              redirect(routes.surveyHome({ surveyId }));
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
