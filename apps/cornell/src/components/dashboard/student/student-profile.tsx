import { getPageData } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	buttonVariants,
} from "@itell/ui/server";
import { User } from "@prisma/client";
import Link from "next/link";
import { UserStatistics } from "../user-statistics";
import { UserProgress } from "../user/user-progress";

type Props = {
	student: User;
	searchParams: Record<string, string>;
};

export const StudentProfile = ({ student, searchParams }: Props) => {
	const page = getPageData(student.pageSlug);
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
				<CardDescription className="space-y-4">
					<div className="flex items-center justify-between">
						<p>{student.email}</p>
						<p>joined at {student.created_at.toLocaleString("en-us")}</p>
					</div>
					<UserProgress user={student} />

					<div className="flex justify-between">
						<p className="text-muted-foreground text-sm font-semibold">
							You are viewing a student in your class
						</p>
						<Link className={buttonVariants()} href="/dashboard/class">
							Back to all students
						</Link>
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<UserStatistics user={student} searchParams={searchParams} />
			</CardContent>
		</Card>
	);
};
