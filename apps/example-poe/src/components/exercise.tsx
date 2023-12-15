export const Exercise = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="border-2 border-accent p-4 rounded-md shadow-sm">
			{children}
		</div>
	);
};
