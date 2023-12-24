"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@itell/ui/server";
import data from "./knowledge-cards.json";
import { KnowledgeCard } from "./knowledge-card";

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
