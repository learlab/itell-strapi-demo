import { LaptopIcon } from "lucide-react";

export function CodingTime({ children }: { children: React.ReactNode }) {
	return (
		<div className="coding-time p-2 lg:p-4 border shadow-md">
			<header className="flex items-center mb-4 gap-2">
				<LaptopIcon />
				<h3 className="text-xl font-medium">Coding Time</h3>
			</header>
			<div className="coding-time-body">{children}</div>
		</div>
	);
}
