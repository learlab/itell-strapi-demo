import { Image } from "@/components/client-components";

export default function ImageWrapper({
	children,
	...rest
}: React.ComponentPropsWithoutRef<typeof Image>) {
	return <Image {...rest}>{children}</Image>;
}
