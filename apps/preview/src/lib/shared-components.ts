import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { BlockquoteWrapper } from "@/components/ui/blockquote";
import { Callout } from "@/components/ui/callout";
import { Sandbox } from "@/components/ui/sandbox";
import { StepsWrapper } from "@/components/ui/steps";
import Image from "next/image";
import { Question } from "./question";
export const components = {
	"i-sandbox-js": Sandbox,
	"i-image": Image,
	"i-blockquote": BlockquoteWrapper,
	"i-callout": Callout,
	"i-accordion": Accordion,
	"i-accordion-item": AccordionItem,
	"i-question": Question,
	"i-steps": StepsWrapper,
};
