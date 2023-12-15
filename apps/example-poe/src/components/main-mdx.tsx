import { Mdx } from "./mdx";
import { MdxComponents } from "./mdx-components";

export const MainMdx = ({ code }: { code: string }) => {
	return <Mdx components={MdxComponents} code={code} />;
};
