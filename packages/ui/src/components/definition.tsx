import { Typography } from "./typography";

export const Definition = ({
	text,
	children,
}: { text: string; children: React.ReactNode }) => {
	return (
		<div className="definition">
			<Typography className="font-bold text-base" variant="lead">
				{text}
			</Typography>
			<Typography className="pl-6" as="div">
				{children}
			</Typography>
		</div>
	);
};
