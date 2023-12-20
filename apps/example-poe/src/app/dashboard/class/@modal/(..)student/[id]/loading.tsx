import { StudentDetailsModal } from "@/components/dashboard/student/student-details-modal";
import { Spinner } from "@/components/spinner";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	InterceptedDialogContent,
} from "@/components/ui/dialog";

export default function () {
	return (
		<Dialog defaultOpen>
			{/* make it wider and scrollable */}
			<InterceptedDialogContent className="md:max-w-2xl lg:max-w-4xl max-h-[600px] overflow-y-scroll">
				<DialogHeader>
					<DialogTitle>
						<Spinner className="mr-2 size-4 inline" /> loading student details
					</DialogTitle>
				</DialogHeader>
			</InterceptedDialogContent>
		</Dialog>
	);
}
