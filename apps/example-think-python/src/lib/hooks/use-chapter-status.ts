import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { isChapterUnlockedWithoutUser } from "../chapter";
import { trpc } from "@/trpc/trpc-provider";
import { useCurrentChapter } from "./utils";

type Status = "unauthorized" | "locked" | "unlocked" | undefined;

export const useChapterStatus = () => {
	const [status, setStatus] = useState<Status>(undefined);
	const currentChapter = useCurrentChapter();
	const { data: session, status: sessionStatus } = useSession();
	const { data: userChapter } = trpc.user.getChapter.useQuery(undefined, {
		enabled: Boolean(session?.user),
		staleTime: Infinity,
	});

	useEffect(() => {
		// when either of the location is not defined, we don't know the status
		if (!currentChapter || !userChapter) {
			return setStatus(undefined);
		}

		// if the location is unlocked without user, we don't need to check the user
		if (isChapterUnlockedWithoutUser(currentChapter)) {
			return setStatus("unlocked");
		}

		// for later sections, the user at least needs to be logged in
		if (!session) {
			return setStatus("unauthorized");
		}

		// if the user is at the same location or after the current location, it is unlocked
		if (userChapter < currentChapter) {
			return setStatus("locked");
		} else {
			setStatus("unlocked");
		}
	}, [sessionStatus, currentChapter, userChapter]);

	return { status, userChapter };
};
