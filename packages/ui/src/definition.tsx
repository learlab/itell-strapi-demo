export const Definition = ({
	text,
	children,
}: { text: string; children: React.ReactNode }) => {
	return (
		<div className="definition">
			<div className="font-semibold text-base leading-relaxed">{text}</div>
			<div className="pl-4 lg:pl-6 font-light leading-relaxed">{children}</div>
		</div>
	);
};
