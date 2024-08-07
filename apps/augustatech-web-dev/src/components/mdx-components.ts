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
import { SandboxWrapper } from "./sandbox-wrapper";
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
	Sandbox: SandboxWrapper,
	// tab related
	Tabs,
	TabsHeader,
	Tab,
	TabPanel,
	TabsBody,
};
