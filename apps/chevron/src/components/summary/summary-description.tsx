import { summaryDescription } from "contentlayer/generated";
import { MainMdx } from "../mdx";

export const SummaryDescription = () => {
	return <MainMdx code={summaryDescription.body.code} />;
};
