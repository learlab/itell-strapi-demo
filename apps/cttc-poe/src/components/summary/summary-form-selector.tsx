"use client";

import { Condition } from "@/lib/control/condition";
import { PageStatus } from "@/lib/page-status";
import { PageData } from "@/lib/utils";
import { User } from "lucia";
import { SummaryDescription } from "./summary-description";
import { SummaryFormReread } from "./summary-form-reread";
import { SummaryFormSimple } from "./summary-form-simple";
import { SummaryFormStairs } from "./summary-form-stairs";

type Props = {
	user: User;
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
		return (
			<SummaryFormSimple
				userId={user.id}
				prolificId={user.prolificId}
				pageStatus={pageStatus}
				page={page}
			/>
		);
	}

	return (
		<section className="grid lg:grid-cols-3 gap-8" id="page-summary">
			<section className="lg:col-span-1">
				<SummaryDescription condition={condition} />
			</section>
			<section className="lg:col-span-2">
				{condition === Condition.RANDOM_REREAD ? (
					<SummaryFormReread user={user} page={page} pageStatus={pageStatus} />
				) : condition === Condition.STAIRS ? (
					<SummaryFormStairs user={user} page={page} pageStatus={pageStatus} />
				) : null}
			</section>
		</section>
	);
};
