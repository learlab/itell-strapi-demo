import { Sandbox } from "@/components/sandbox";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Image } from "@itell/ui/client";
import { Info } from "@itell/ui/server";

export const components = {
	"callout-info": Info,
	"js-sandbox": Sandbox,
	"accordion-wrapper": Accordion,
	"accordion-item": AccordionItem,
	"my-image": Image,
};
