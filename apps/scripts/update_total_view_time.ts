import { FocusTime } from "@prisma/client";
import db from "../src/lib/db";

type FocusTimeData = {
	sectionId: string;
	totalViewTime: number;
};

const getTotalViewTime = (entry: FocusTime) => {
	const totalViewTime = (entry.data as FocusTimeData[]).reduce((acc, cur) => {
		return acc + cur.totalViewTime;
	}, 0);

	return totalViewTime;
};

const main = async () => {
	const data = await db.focusTime.findMany();

	data.forEach(async (d) => {
		const totalViewTime = getTotalViewTime(d);
		await db.focusTime.update({
			where: {
				id: d.id,
			},
			data: {
				totalViewTime,
			},
		});
	});
};

main();
