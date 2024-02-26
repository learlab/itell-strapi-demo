"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import data from "public/knowledge-cards.json";
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
