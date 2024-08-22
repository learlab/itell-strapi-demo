"use client";

import { Card, CardContent } from "@itell/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@itell/ui/carousel";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import data from "public/knowledge-cards.json";

export const KnowledgeCarousel = () => {
	return (
		<Carousel className="max-w-lg mx-auto">
			<CarouselContent>
				{data.map((item, index) => (
					<CarouselItem key={index}>
						<KnowledgeCard {...item} />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
};

export const KnowledgeCard = ({
	text,
	source,
	href,
}: {
	text: string;
	source: string;
	href: string;
}) => {
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
									// fix for "aria-hidden elements contain focusable elements" (the parent container for this component is aria-hidden)
									tabIndex={-1}
								>
									<span className="flex items-center gap-2">
										<LinkIcon className="size-4" />
										{source}
									</span>
								</Link>
							</div>
						</figcaption>
					</figure>
				</CardContent>
			</Card>
		</div>
	);
};
