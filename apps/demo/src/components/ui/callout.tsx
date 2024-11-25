import { cn } from "@itell/utils";
import { CircleAlertIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

interface CalloutProps extends React.ComponentProps<"div"> {
  title?: string;
  variant?: "info" | "warning" | "danger";
  children: React.ReactNode;
}

const icons = {
  info: <InfoIcon className="size-8 text-info" />,
  warning: <CircleAlertIcon className="size-8 text-warning" />,
  danger: <TriangleAlertIcon className="size-8 text-destructive" />,
};

const titles = {
  info: "Note",
  warning: "Warning",
  danger: "Caution",
};

/**
 * General callout component for displaying information, warnings, and cautions.
 * @param title - The title of the callout, optional. If not provided, the title will be "Note", "Warning", or "Caution" based on the variant. Defaults to "Note".
 * @param variant - The variant of the callout, "info", "warning", or "danger". Defaults to "info".
 * @param children - nested elements
 * @example
 * <i-callout variant="info">
 * 	this is **important**
 * </i-callout>
 */
export function Callout({
  variant = "info",
  title,
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "duration-350 relative my-4 rounded-md border-l-4 bg-accent p-6 leading-relaxed transition-colors",
        {
          "border-l-info": variant === "info",
          "border-l-warning": variant === "warning",
          "border-l-destructive": variant === "danger",
        },
        className
      )}
      {...props}
    >
      <div className="absolute left-0 top-0 -translate-x-[calc(50%+1.5px)] -translate-y-1/2 transform rounded-full bg-background p-2 leading-[calc(1em+0.725rem)]">
        {icons[variant]}
      </div>
      <strong className="mb-2 block text-[1.1em] font-bold">
        {title ?? titles[variant]}
      </strong>
      {children}
    </div>
  );
}
