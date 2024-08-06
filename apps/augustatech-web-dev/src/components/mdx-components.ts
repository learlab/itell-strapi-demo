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

import {
	Tab,
	TabPanel,
	Tabs,
	TabsBody,
	TabsHeader,
} from "@/components/ui/tabs";
import { Image } from "@itell/ui/client";
import { Sandbox } from "@textbook/sandbox";
import { Accordion, AccordionItem } from "./ui/accordion";

export const MdxComponents = {
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
	Sandbox,
	// tab related
	Tabs,
	TabsHeader,
	Tab,
	TabPanel,
	TabsBody,
};
