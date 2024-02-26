import { User } from "@prisma/client";
import { PageUnauthorizedModal } from "./page-unauthorized-modal";
import { PageLockedModal } from "./page-locked-modal";
import { isPageAfter, isPageUnlockedWithoutUser } from "@/lib/location";
import { PageStatus } from "@/lib/page-status";

type Props = {
	user: User | null;
	pageStatus: PageStatus;
};

export const PageStatusModal = ({ user, pageStatus }: Props) => {
	const { isPageLatest, isPageUnlocked } = pageStatus;

	if (isPageUnlocked) {
		return null;
	}

	// user with locked page
	if (user) {
		if (isPageLatest) {
			return null;
		}

		return <PageLockedModal userPageSlug={user.pageSlug} />;
	}

	// no user, and page is locked
	return <PageUnauthorizedModal />;
};
