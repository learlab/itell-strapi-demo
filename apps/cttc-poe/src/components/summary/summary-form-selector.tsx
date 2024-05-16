"use client";

import { SessionUser } from "@/lib/auth";
import { FeedbackType } from "@/lib/control/feedback";
import { PageStatus } from "@/lib/page-status";
import { PageData } from "@/lib/utils";
import { Fragment } from "react";
import { usePage } from "../provider/page-provider";
import { SummaryDescription } from "./summary-description";
import { SummaryFormReread } from "./summary-form-reread";
import { SummaryFormSimple } from "./summary-form-simple";
import { SummaryFormStairs } from "./summary-form-stairs";

type Props = {
	user: NonNullable<SessionUser>;
	page: PageData;
	pageStatus: PageStatus;
};

export const SummaryFormSelector = ({ user, page, pageStatus }: Props) => {
	const feedbackType = usePage((state) => state.feedbackType);

	if (feedbackType === FeedbackType.SIMPLE) {
		return <SummaryFormSimple />;
	}

	if (feedbackType === FeedbackType.RANDOM_REREAD) {
		return (
			<section className="flex flex-col sm:flex-row gap-8" id="page-summary">
				<section className="sm:basis-1/3">
					<SummaryDescription />
				</section>
				<section className="sm:basis-2/3">
					<SummaryFormReread user={user} page={page} pageStatus={pageStatus} />
				</section>
			</section>
		);
	}

	if (feedbackType === FeedbackType.STAIRS) {
		return (
			<section className="flex flex-col sm:flex-row gap-8" id="page-summary">
				<section className="sm:basis-1/3">
					<SummaryDescription />
				</section>
				<section className="sm:basis-2/3">
					<SummaryFormStairs user={user} page={page} pageStatus={pageStatus} />
				</section>
			</section>
		);
	}
};
