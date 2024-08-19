import { Image } from "@itell/ui/client";

export const ImageWrapper = ({ children, ...rest }: Image.Props) => {
	console.log(rest.expandable);
	return <Image {...rest}>{children}</Image>;
};
