"use client";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	InterceptedDialogContent,
} from "@/components/ui/dialog";
import { User } from "@/drizzle/schema";
export const StudentDetailsModal = ({
	children,
	student,
}: { children: React.ReactNode; student: User }) => {
	return (
		<Dialog defaultOpen>
			{/* make it wider and scrollable */}
			<InterceptedDialogContent className="md:max-w-2xl lg:max-w-4xl max-h-[600px] overflow-y-scroll">
				<DialogHeader>
					<DialogTitle asChild>
						<h2 className="text-lg leading-relaxed font-semibold">
							{student.name}
							<span className="ml-2 text-muted-foreground text-sm font-light">
								{student.email}
							</span>
						</h2>
					</DialogTitle>
					<DialogDescription>
						You are viewing a student in your class.{" "}
						<a
							className="font-semibold underline"
							href={`/dashboard/student/${student.id}`}
						>
							Expand
						</a>{" "}
						for details.
					</DialogDescription>
				</DialogHeader>
				{children}
			</InterceptedDialogContent>
		</Dialog>
	);
};
