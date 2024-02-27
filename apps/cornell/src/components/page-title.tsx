export const PageTitle = ({ children }: { children: React.ReactNode }) => {
	return (
		<h1
			className="text-3xl font-semibold mb-4 text-center flex items-center justify-center gap-2 text-pretty"
			id="page-title"
		>
			{children}
		</h1>
	);
};
