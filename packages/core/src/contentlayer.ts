import GithubSlugger from "github-slugger";

export type Heading = {
	level: "one" | "two" | "three" | "other";
	text: string | undefined;
	slug: string | undefined;
};

export const getHeadingsFromRawBody = (doc: string) => {
	const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
	const slugger = new GithubSlugger();
	const headings = Array.from(doc.matchAll(regXHeader)).map(
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		({ groups }: any) => {
			const flag = groups?.flag;
			const content = groups?.content;
			return {
				level:
					flag?.length === 1
						? "one"
						: flag?.length === 2
						? "two"
						: flag?.length === 3
						? "three"
						: "other",
				text: content,
				slug: content ? slugger.slug(content) : undefined,
			};
		},
	);
	return headings;
};
