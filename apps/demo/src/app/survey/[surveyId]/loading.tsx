import { Skeleton } from "@itell/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex w-full items-center justify-center p-6 xl:mx-auto xl:max-w-3xl">
      <Skeleton className="h-full w-full" />
    </main>
  );
}
