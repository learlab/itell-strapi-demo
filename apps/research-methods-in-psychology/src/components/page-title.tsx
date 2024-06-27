export const PageTitle = ({ children }: { children: React.ReactNode }) => {
	return (
		<h1
			className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-center text-balance"
			id="page-title"
		>
			{children}
		</h1>
	);
};
