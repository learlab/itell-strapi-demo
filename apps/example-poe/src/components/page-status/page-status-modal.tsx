import { User } from "@prisma/client";
import { PageUnauthorizedModal } from "./page-unauthorized-modal";
import { PageLockedModal } from "./page-locked-modal";
import { isPageAfter, isPageUnlockedWithoutUser } from "@/lib/location";

type Props = {
	isWhitelisted: boolean;
	user: User | null;
	pageSlug: string;
};

export const PageStatusModal = ({ pageSlug, user, isWhitelisted }: Props) => {
	if (isPageUnlockedWithoutUser(pageSlug) || isWhitelisted) {
		return null;
	}

	if (!user) {
		return <PageUnauthorizedModal />;
	}

	if (isPageAfter(pageSlug, user.pageSlug)) {
		return <PageLockedModal userPageSlug={user.pageSlug} />;
	}

	return null;
};
