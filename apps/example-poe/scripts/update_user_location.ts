import db from "../src/lib/db";

const main = async () => {
	const userWithPassedsummaries = await db.user.findMany({
		include: {
			summaries: {
				where: {
					isPassed: true,
				},
			},
		},
	});

	userWithPassedsummaries.forEach(async (user) => {
		if (user.summaries.length > 0) {
			user.summaries.sort((a, b) => {
				if (a.chapter === b.chapter) {
					return b.section - a.section;
				}

				return b.chapter - a.chapter;
			});

			await db.user.update({
				where: {
					id: user.id,
				},
				data: {
					module: user.summaries[0].module,
					chapter: user.summaries[0].chapter,
					section: user.summaries[0].section,
				},
			});
		}
	});
};

main();
