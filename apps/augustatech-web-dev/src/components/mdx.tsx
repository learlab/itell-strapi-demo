import { Image } from "@itell/ui/client";
import { Prose } from "@itell/ui/server";
import * as runtime from "react/jsx-runtime";
import { TextbookComponents } from "./mdx-components";

const useMDXComponent = (code: string) => {
	const fn = new Function(code);
	return fn({ ...runtime }).default;
};

interface MdxProps extends Omit<Prose.Props, "children"> {
	code: string;
	components?: Record<string, any>;
}

export const Mdx = ({ code, components = { Image }, ...rest }: MdxProps) => {
	const Component = useMDXComponent(code);

	return (
		<Prose {...rest}>
			<Component components={components} />
		</Prose>
	);
};
