import { Skeleton } from "@itell/ui/skeleton";

export default function Loading() {
	return (
		<>
			<header className="flex items-center justify-between">
				<Skeleton className="h-[38px] w-[90px]" />
			</header>
			<main className="grid gap-12 md:grid-cols-[200px_700px] mt-4">
				<div className="hidden w-[200px] flex-col md:flex space-y-4">
					<Skeleton className="w-full h-[30px]" />
				</div>
				<div className="space-y-2 text-center">
					<Skeleton className="h-[50px] w-full" />
					<Skeleton className="h-[30px] w-64 mx-auto" />
					<Skeleton className="h-[30px] w-40 mx-auto" />
					<Skeleton className="h-[300px] w-full" />
					<div className="flex justify-end">
						<Skeleton className="h-[38px] w-[100px]" />
					</div>
				</div>
			</main>
		</>
	);
}
