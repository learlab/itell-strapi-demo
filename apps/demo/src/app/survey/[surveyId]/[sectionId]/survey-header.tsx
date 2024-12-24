import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@itell/ui/breadcrumb";
import { Separator } from "@itell/ui/separator";
import { SidebarTrigger } from "@itell/ui/sidebar";

import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";

export async function SurveyHeader({
  surveyId,
  surveyTitle,
  sectionTitle,
}: {
  surveyId: string;
  surveyTitle: string;
  sectionTitle: string;
}) {
  const { user } = await getSession();

  return (
    <header className="flex h-[var(--nav-height)] shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={routes.surveyHome({ surveyId })}>
              {surveyTitle}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{sectionTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <CommandMenu />
        <ThemeToggle />
        <UserAccountNav user={user} />
      </div>
    </header>
  );
}
