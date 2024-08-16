import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@itell/ui/server";

export default function () {
	return (
		<main className="flex flex-col gap-4 py-8 px-16 lg:px-32">
			<div className="flex justify-center gap-4 items-center">
				<h1 className="text-2xl tracking-tight font-extrabold leading-tight text-center">
					iTELL Markdown Preview
				</h1>
				<ThemeToggle />
			</div>

			<div className="grid grid-cols-[1fr_1fr] mt-8 h-[500px] gap-8">
				<Skeleton />
				<Skeleton />
			</div>
		</main>
	);
}
