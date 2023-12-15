import GithubSlugger from "github-slugger";

export const parseLocation = (
	x: string,
	defaultVal: number | undefined = undefined,
) => (x ? parseInt(x.split("-")[1]) : defaultVal);

export const getSlugFromFlattenedPath = (path: string, prefix?: string) => {
	return path.replace(prefix || "", "");
};

export const getLocationFromFlattenedPath = (path: string) => {
	// example path "/section/module-1/chapter-1/section-1"
	const slugSplit = path.substring(1).split("/");
	const [_, module, chapter, section] = slugSplit;
	return {
		module: parseLocation(module),
		chapter: parseLocation(chapter),
		section: parseLocation(section, 0),
	};
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
