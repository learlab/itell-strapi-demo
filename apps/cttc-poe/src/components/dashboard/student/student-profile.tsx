import { User } from "@/drizzle/schema";
import { routes, useSafeSearchParams } from "@/lib/navigation";
import { getPageData } from "@/lib/utils";
import { ReadingTimeChartLevel } from "@itell/core/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	buttonVariants,
} from "@itell/ui/server";
import Link from "next/link";
import { UserStatistics } from "../user-statistics";
import { UserProgress } from "../user/user-progress";

type Props = {
	student: User;
	searchParams: unknown;
};

export const StudentProfile = ({ student, searchParams }: Props) => {
	const page = getPageData(student.pageSlug);
	const { reading_time_level } =
		routes.student.$parseSearchParams(searchParams);
	let readingTimeLevel = ReadingTimeChartLevel.week_1;
	if (
		Object.values(ReadingTimeChartLevel).includes(
			reading_time_level as ReadingTimeChartLevel,
		)
	) {
		readingTimeLevel = reading_time_level as ReadingTimeChartLevel;
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between">
						<p>{student.name}</p>
						<p className="text-muted-foreground text-sm font-medium">
							at chapter{" "}
							<span className="ml-1 font-semibold">{page?.chapter}</span>
						</p>
					</div>
				</CardTitle>
				<div className="text-muted-foreground space-y-4">
					<div className="flex items-center justify-between">
						<p>{student.email}</p>
						<p>joined at {student.createdAt.toLocaleString("en-us")}</p>
					</div>
					<UserProgress
						pageSlug={student.pageSlug}
						finished={student.finished}
					/>

					<div className="flex justify-between">
						<p className="text-muted-foreground text-sm font-semibold">
							You are viewing a student in your class
						</p>
						<Link className={buttonVariants()} href="/dashboard/class">
							Back to all students
						</Link>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<UserStatistics user={student} readingTimeLevel={readingTimeLevel} />
			</CardContent>
		</Card>
	);
};
