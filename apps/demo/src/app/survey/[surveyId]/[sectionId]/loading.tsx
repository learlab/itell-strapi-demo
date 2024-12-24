import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@itell/ui/breadcrumb";
import { Separator } from "@itell/ui/separator";
import { Skeleton } from "@itell/ui/skeleton";

import { SidebarTrigger } from "@/components/sidebar";

export default function Loading() {
  return (
    <div className="flex h-[100vh] flex-col">
      <header className="flex h-[var(--nav-height)] shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <Skeleton className="h-6 w-36" />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <Skeleton className="h-6 w-36" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex w-full flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
