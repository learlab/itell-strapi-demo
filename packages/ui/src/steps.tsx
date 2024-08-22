export const Steps = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className="steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
			data-testid="steps"
		>
			{children}
		</div>
	);
};
