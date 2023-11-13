import db from "@/lib/db";

const start = async () => {
	const class_id = "scott_class";
	const scott = await db.user.findUnique({
		where: {
			email: "sacrossley@gmail.com",
		},
	});

	if (scott) {
		await db.teacher.upsert({
			where: {
				id: scott.id,
			},
			update: {
				isApproved: true,
				classId: class_id,
			},
			create: {
				id: scott.id,
				isApproved: true,
				classId: class_id,
			},
		});
	}
};

start();
