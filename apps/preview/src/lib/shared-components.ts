import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Callout } from "@/components/ui/callout";
import { Sandbox } from "@/components/ui/sandbox";
import { Blockquote } from "@itell/ui/blockquote";
import Image from "next/image";
import { Question } from "./question";

export const components = {
	"i-sandbox-js": Sandbox,
	"i-image": Image,
	"i-blockquote": Blockquote,
	"i-callout": Callout,
	"i-accordion": Accordion,
	"i-accordion-item": AccordionItem,
	"i-question": Question,
};
