import { MainNav } from "@/components/main-nav";

export default function ({ children }: { children: React.ReactNode }) {
	return (
		<>
			<MainNav scrollProgress />
			<main className="max-w-4xl mx-auto min-h-screen p-4 lg:p-8">
				{children}
			</main>
		</>
	);
}
