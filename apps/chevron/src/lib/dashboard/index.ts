import subDays from "date-fns/subDays";
import db from "../db";

export const getBadgeStats = async (uid: string) => {
	const startDate = subDays(new Date(), 7);
	const [summaries, answers] = await Promise.all([
		db.summary.findMany({
			select: {
				isPassed: true,
				contentScore: true,
				wordingScore: true,
				created_at: true,
			},
			where: {
				userId: uid,
			},
		}),
		db.constructedResponse.findMany({
			select: {
				score: true,
				created_at: true,
			},
			where: {
				userId: uid,
			},
		}),
	]);
	const summariesLastWeek = [];
	const answersLastWeek = [];
	const passedSummaries = [];
	const passedSummariesLastWeek = [];
	const passedAnswers = [];
	const passedAnswersLastWeek = [];
	const contentScores: number[] = [];
	const wordingScores: number[] = [];
	const contentScoresLastWeek: number[] = [];
	const wordingScoresLastWeek: number[] = [];

	summaries.forEach((summary) => {
		const passed = summary.isPassed;
		const duringLastWeek = summary.created_at > startDate;
		if (summary.contentScore) {
			contentScores.push(summary.contentScore);
		}
		if (summary.wordingScore) {
			wordingScores.push(summary.wordingScore);
		}

		if (passed) {
			passedSummaries.push(summary);
		}
		if (duringLastWeek) {
			summariesLastWeek.push(summary);
			if (summary.contentScore) {
				contentScoresLastWeek.push(summary.contentScore);
			}
			if (summary.wordingScore) {
				wordingScoresLastWeek.push(summary.wordingScore);
			}
		}
		if (passed && duringLastWeek) {
			passedSummariesLastWeek.push(summary);
		}
	});

	answers.forEach((answer) => {
		const passed = answer.score === 2;
		const duringLastWeek = answer.created_at > startDate;

		if (passed) {
			passedAnswers.push(answer);
		}
		if (duringLastWeek) {
			answersLastWeek.push(answer);
		}
		if (passed && duringLastWeek) {
			passedAnswersLastWeek.push(answer);
		}
	});

	return {
		avgContentScore:
			contentScores.reduce((a, b) => a + b, 0) / contentScores.length,
		avgContentScoreLastWeek:
			contentScoresLastWeek.reduce((a, b) => a + b, 0) /
			contentScoresLastWeek.length,
		avgWordingScore:
			wordingScores.reduce((a, b) => a + b, 0) / wordingScores.length,
		avgWordingScoreLastWeek:
			wordingScoresLastWeek.reduce((a, b) => a + b, 0) /
			wordingScoresLastWeek.length,
		totalCount: summaries.length,
		totalCountLastWeek: summariesLastWeek.length,
		passedCount: passedSummaries.length,
		passedCountLastWeek: passedSummariesLastWeek.length,
		totalConstructedResponses: answers.length,
		totalConstructedResponsesLastWeek: answersLastWeek.length,
		passedConstructedResponses: passedAnswers.length,
		passedConstructedResponsesLastWeek: passedAnswersLastWeek.length,
	};
};

export const getClassBadgeStats = async (uids: string[]) => {
	const [avgWording, avgContent, allSummaries, allConstructedResponses] =
		await Promise.all([
			db.summary.aggregate({
				_avg: {
					wordingScore: true,
				},
				where: {
					userId: {
						in: uids,
					},
					wordingScore: { not: null },
				},
			}),
			db.summary.aggregate({
				_avg: {
					contentScore: true,
				},
				where: {
					userId: {
						in: uids,
					},
					contentScore: { not: null },
				},
			}),
			db.summary.findMany({
				select: {
					isPassed: true,
				},
				where: {
					userId: {
						in: uids,
					},
				},
			}),

			db.constructedResponse.findMany({
				where: {
					userId: {
						in: uids,
					},
				},
			}),
		]);

	return {
		avgContentScore: avgContent._avg.contentScore,
		avgWordingScore: avgWording._avg.wordingScore,
		totalCount: allSummaries.length,
		passedCount: allSummaries.filter((s) => s.isPassed).length,
		totalConstructedResponses: allConstructedResponses.length,
		passedConstructedResponses: allConstructedResponses.filter(
			(cr) => cr.score === 2,
		).length,
	};
};

export const getUserTeacherStatus = async (uid: string) => {
	const teacher = await db.teacher.findUnique({
		where: {
			id: uid,
		},
	});

	if (!teacher || !teacher.classId) {
		return null;
	}

	return teacher;
};

export const getUserWithClass = async ({
	userId,
	classId,
}: { userId: string; classId: string }) => {
	const user = await db.user.findFirst({
		where: {
			id: userId,
			classId,
		},
	});

	if (!user) {
		return null;
	}

	return user;
};

export const userIsStudent = async (uid: string) => {
	return Boolean(
		(
			await db.user.findUnique({
				where: {
					id: uid,
				},
			})
		)?.classId,
	);
};
