import { Image } from "@itell/ui/image";
import { Prose } from "@itell/ui/prose";
import * as runtime from "react/jsx-runtime";

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
