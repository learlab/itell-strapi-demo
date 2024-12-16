import { Button } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { Column } from "@tanstack/react-table";
import { ArrowUp } from "lucide-react";

export function ColumnWithSorting<TData>({
  column,
  text,
  className,
}: {
  column: Column<TData>;
  text: string;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
      className={cn("px-1", className)}
    >
      <span className="flex items-center gap-2">
        <ArrowUp
          className={cn(
            "size-4 shrink-0 transition duration-100",
            column.getIsSorted() === "desc" && "rotate-180"
          )}
        />
        {text}
      </span>
    </Button>
  );
}
