import { Card, CardDescription, CardHeader, CardTitle } from "@itell/ui/card";

type Props = {
	title: string;
	volume?: string | null;
	className?: string;
};

export const PageCard = ({ title, volume, className }: Props) => {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{volume || "No associated volume"}</CardDescription>
			</CardHeader>
		</Card>
	);
};
