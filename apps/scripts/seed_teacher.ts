import db from "../src/lib/db";

const teachers = [
	{
		teacher_email: "qiushi.yann@gmail.com",
		student_emails: ["jchoi92@gsu.edu", "langdonholmes@gmail.com"],
		class_id: "test_class_id",
	},
	{
		teacher_email: "jchoi92@gsu.edu",
		student_emails: ["choijoonsuh@gmail.com", "lydialiu2003@gmail.com"],
		class_id: "test_class_id_2",
	},
	{
		teacher_email: "langdonholmes@gmail.com",
		student_emails: ["lear.lab.vu@gmail.com"],
		class_id: "test_class_id_3",
	},
];

const main = async () => {
	teachers.forEach(async (entry) => {
		const teacher = await db.user.findFirst({
			where: {
				email: entry.teacher_email,
			},
		});

		if (!teacher) {
			return console.log("can't find teacher with email", entry.teacher_email);
		}

		await db.teacher.upsert({
			where: {
				id: teacher.id,
			},
			update: {
				isApproved: true,
				classId: entry.class_id,
			},
			create: {
				id: teacher.id,
				isApproved: true,
				classId: entry.class_id,
			},
		});

		await db.user.updateMany({
			where: {
				email: {
					in: entry.student_emails,
				},
			},
			data: {
				classId: entry.class_id,
			},
		});
	});
};

main();
