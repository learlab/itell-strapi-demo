import {
	Info,
	Warning,
	Keyterm,
	Callout,
	Caption,
	Blockquote,
	Definition,
	Steps,
	YoutubeVideo,
} from "@itell/ui/server";
import Image from "@/components/ui/image";
import { Exercise } from "./exercise";
import { Notebook } from "@/components/code/notebook";
import { CodeRepl } from "@/components/code/code-repl-wrapper";
import { CodingTime } from "@/components/code/coding-time";

export const MdxComponents = {
	// YoutubeVideo,
	Blockquote,
	Info,
	Warning,
	Keyterm,
	Callout,
	Caption,
	Definition,
	Steps,
	// exercise related
	Exercise,
	Notebook,
	CodeRepl,
	Image,
	YoutubeVideo,
	CodingTime,
};
