export default function ({ children }: { children: React.ReactNode }) {
	return (
		<main className="max-w-2xl lg:max-w-7xl mx-auto p-4 lg:p-8">
			{children}
		</main>
	);
}
