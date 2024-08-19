import { Image } from "@itell/ui/client";
import { Prose } from "@itell/ui/server";
import htmr from "htmr";
import { ImageWrapper } from "./ui/image";

interface MdxProps extends Omit<Prose.Props, "children"> {
	html: string;
	components?: Record<string, any>;
}

export const ProseContent = ({
	html,
	components = { "i-image": ImageWrapper },
	...rest
}: MdxProps) => {
	return <Prose {...rest}>{htmr(html, { transform: components })}</Prose>;
};
