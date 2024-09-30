"use client";

import * as React from "react";

import { SIDEBAR_STATE_COOKIE } from "@/lib/constants";
import { setCookie } from "@/lib/cookie";
import { useIsMobile } from "@itell/core/hooks";
import { Button } from "@itell/ui/button";
import { Sheet, SheetContent } from "@itell/ui/sheet";
import { cn } from "@itell/utils";
import { PanelLeft } from "lucide-react";

/**
 * cookie name for sidebar state
 *
 * @example
 * cookies().get(SIDEBAR_STATE_COOKIE)?.value === "true"
 */

type SidebarContextType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const SidebarContext = React.createContext<SidebarContextType>(
  {} as SidebarContextType
);

function useSidebar() {
  return React.useContext(SidebarContext);
}

const SidebarLayout = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
  }
>(({ defaultOpen, className, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen ?? true);

  const onOpenChange = React.useCallback((open: boolean) => {
    setOpen(open);
    setCookie(SIDEBAR_STATE_COOKIE, open);
  }, []);

  const state = open ? "open" : "closed";

  return (
    <SidebarContext.Provider value={{ open, onOpenChange }}>
      <div
        ref={ref}
        data-sidebar={state}
        style={
          {
            "--sidebar-width": "16rem",
          } as React.CSSProperties
        }
        className={cn(
          "flex min-h-screen pl-0 transition-all duration-300 ease-in-out data-[sidebar=closed]:pl-0 sm:pl-[--sidebar-width]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarLayout.displayName = "SidebarLayout";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { open, onOpenChange } = useSidebar();

  return (
    <Button
      ref={ref}
      id="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-6", className)}
      onClick={() => {
        onOpenChange(!open);
      }}
      {...props}
    >
      <PanelLeft className="size-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

function Sidebar({ children, className }: React.ComponentProps<"div">) {
  const isMobile = useIsMobile();
  const { open, onOpenChange } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className={cn(
            "w-[260px] p-0 md:w-[--sidebar-width] [&>button]:hidden",
            className
          )}
          side="left"
        >
          <SidebarInner>{children}</SidebarInner>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[--sidebar-width] transition-all duration-300 ease-in-out md:block [[data-sidebar=closed]_&]:left-[calc(var(--sidebar-width)*-1)]">
      <SidebarInner>{children}</SidebarInner>
    </aside>
  );
}

function SidebarInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col border-r bg-background">
      {children}
    </div>
  );
}

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center border-b px-2.5 py-2", className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center border-t px-2.5 py-2", className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col gap-5 overflow-auto py-4", className)}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("grid gap-2 px-2.5", className)} {...props} />
  );
});
SidebarItem.displayName = "SidebarItem";

const SidebarLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "px-1.5 text-base font-medium text-muted-foreground lg:text-lg",
        className
      )}
      {...props}
    />
  );
});
SidebarLabel.displayName = "SidebarLabel";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarLayout,
  SidebarTrigger,
  useSidebar,
};
