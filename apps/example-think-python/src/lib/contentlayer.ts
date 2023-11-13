import GithubSlugger from "github-slugger";

export const getHeadingsFromRawBody = (doc: string) => {
	const lines = doc.split("\n");
	let inCodeBlock = false;
	const cleanedLines: string[] = [];

	lines.forEach((line) => {
		const l = line.trim();
		if (
			l.startsWith("```") ||
			// regex match <Steps> or </Steps>
			l.match(/<Steps>|<\/Steps>/)
		) {
			inCodeBlock = !inCodeBlock; // Toggle the flag whenever we encounter ```
		}

		if (!inCodeBlock) {
			cleanedLines.push(line);
		}
	});

	const cleanedDoc = cleanedLines.join("\n");

	const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
	const slugger = new GithubSlugger();
	const headings = Array.from(cleanedDoc.matchAll(regXHeader)).map(
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
