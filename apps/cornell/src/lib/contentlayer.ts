import GithubSlugger from "github-slugger";

export const getHeadingsFromRawBody = (doc: string) => {
	const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;

	const slugger = new GithubSlugger();

	const headings = Array.from(doc.matchAll(regXHeader)).map(
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
							  : flag?.length === 4
								  ? "four"
								  : "other",

				text: content,

				slug: content ? slugger.slug(content) : undefined,
			};
		},
	);

	return headings;
};
