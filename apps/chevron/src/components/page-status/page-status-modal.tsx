import { PageStatus } from "@/lib/page-status";
import { User } from "lucia";
import { PageLockedModal } from "./page-locked-modal";
import { PageUnauthorizedModal } from "./page-unauthorized-modal";

type Props = {
	user: User | null;
	pageStatus: PageStatus;
};

export const PageStatusModal = ({ user, pageStatus }: Props) => {
	const { latest, unlocked } = pageStatus;

	if (unlocked) {
		return null;
	}

	// user with locked page
	if (user) {
		if (latest) {
			return null;
		}

		return <PageLockedModal userPageSlug={user.pageSlug} />;
	}

	// no user, and page is locked
	return <PageUnauthorizedModal />;
};
