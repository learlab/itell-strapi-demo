import { Blockquote, Card, CardContent } from "@itell/ui/server";
import { ArrowRightIcon, LinkIcon } from "lucide-react";
import Link from "next/link";

type Props = {
	text: string;
	source: string;
	href: string;
};

export const KnowledgeCard = ({ text, source, href }: Props) => {
	return (
		<div className="p-1">
			<Card>
				<CardContent className="flex aspect-square items-center justify-center p-6">
					<figure>
						<svg
							aria-hidden="true"
							className="size-4 mx-auto mb-3"
							viewBox="0 0 24 27"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
								fill="currentColor"
							/>
						</svg>
						<blockquote className="border-none">
							<p className="leading-snug font-light text-lg text-muted-foreground">
								{text}
							</p>
						</blockquote>
						<figcaption className="flex items-center justify-center mt-6 space-x-3 text-lg">
							<div className="flex items-center divide-x-2">
								<Link
									className="italic inline-flex items-center hover:underline"
									href={href}
								>
									<LinkIcon className="size-4 mr-2" />
									{source}
								</Link>
							</div>
						</figcaption>
					</figure>
				</CardContent>
			</Card>
		</div>
	);
};
