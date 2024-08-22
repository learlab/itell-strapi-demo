import { Blockquote } from "@itell/ui/blockquote";
import { Image } from "@itell/ui/image";
import { Accordion, AccordionItem } from "./ui/accordion";
import { Callout } from "./ui/callout";
import { Question } from "./ui/question";

export const TextbookComponents = {
	"i-image": Image,
	"i-question": Question,
	"i-blockquote": Blockquote,
	"i-callout": Callout,
	"i-accordion": Accordion,
	"i-accordion-item": AccordionItem,
};

export const GuideComponents = {
	"i-image": Image,
	"i-callout": Callout,
	"i-accordion": Accordion,
	"i-accordion-item": AccordionItem,
};
