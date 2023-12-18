import { User } from "@prisma/client";
import { PageUnauthorizedModal } from "./page-unauthorized-modal";
import { PageLockedModal } from "./page-locked-modal";
import { SectionLocation } from "@/types/location";
import { isLocationAfter, isLocationUnlockedWithoutUser } from "@/lib/location";

type Props = {
	isWhitelisted: boolean;
	location: SectionLocation;
	user: User | null;
};

export const PageStatusModal = ({ location, user, isWhitelisted }: Props) => {
	if (isLocationUnlockedWithoutUser(location) || isWhitelisted) {
		return null;
	}

	if (!user) {
		return <PageUnauthorizedModal />;
	}

	const userLocation = {
		module: user.module,
		chapter: user.chapter,
		section: user.section,
	};

	if (isLocationAfter(location, userLocation)) {
		return <PageLockedModal userLocation={userLocation} />;
	}

	return null;
};
