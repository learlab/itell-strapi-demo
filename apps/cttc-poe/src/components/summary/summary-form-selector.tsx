"use client";

import { SessionUser } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";
import { PageStatus } from "@/lib/page-status";
import { PageData } from "@/lib/utils";
import { SummaryDescription } from "./summary-description";
import { SummaryFormReread } from "./summary-form-reread";
import { SummaryFormSimple } from "./summary-form-simple";
import { SummaryFormStairs } from "./summary-form-stairs";

type Props = {
	user: NonNullable<SessionUser>;
	page: PageData;
	pageStatus: PageStatus;
	condition: string;
};

export const SummaryFormSelector = ({
	user,
	page,
	pageStatus,
	condition,
}: Props) => {
	if (condition === Condition.SIMPLE) {
		return <SummaryFormSimple />;
	}

	if (condition === Condition.RANDOM_REREAD) {
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

	if (condition === Condition.STAIRS) {
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
