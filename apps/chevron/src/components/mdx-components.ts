import {
	Tab,
	TabPanel,
	Tabs,
	TabsBody,
	TabsHeader,
} from "@/components/ui/tabs";
import { Image } from "@itell/ui/client";
import {
	Blockquote,
	Callout,
	Caption,
	Column,
	Columns,
	Info,
	Keyterm,
	Steps,
	Warning,
	YoutubeVideo,
} from "@itell/ui/server";
import { CustomLink } from "./custom-link";
import { Accordion, AccordionItem } from "./ui/accordion";

export const TextbookComponents = {
	YoutubeVideo,
	Image,
	Blockquote,
	Accordion,
	AccordionItem,
	Info,
	Warning,
	Keyterm,
	Callout,
	Caption,
	Steps,
	Columns,
	Column,
	// tab related
	Tabs,
	TabsHeader,
	Tab,
	TabPanel,
	TabsBody,
	a: CustomLink,
};
