import { Image } from "@itell/ui/image";
import { Prose } from "@itell/ui/prose";
import htmr from "htmr";

interface MdxProps extends Omit<Prose.Props, "children"> {
	html: string;
	components?: Record<string, any>;
}

export const ProseContent = ({
	html,
	components = { "i-image": Image },
	...rest
}: MdxProps) => {
	return (
		<Prose {...rest}>
			{htmr(html, {
				transform: components,
			})}
		</Prose>
	);
};
