import { User } from "lucia";

import type { PersonalizationData } from "@/drizzle/schema";

export function updatePersonalization(
  user: User,
  { isSummaryPassed }: { isSummaryPassed: boolean }
): PersonalizationData {
  const personalization: PersonalizationData = user.personalization ?? {};

  // increment streak count by one if summary is a passing one
  const newSummaryStreak = isSummaryPassed
    ? (user.personalization.summary_streak || 0) + 1
    : 0;
  personalization.summary_streak = newSummaryStreak;

  // update max streak count
  if (newSummaryStreak > (user.personalization.max_summary_streak || 0)) {
    personalization.max_summary_streak = newSummaryStreak;
  }

  // every new passing summary after a streak allows user to skip one summary
  if (isSummaryPassed && newSummaryStreak >= 2) {
    personalization.available_summary_skips = 1;
  } else {
    personalization.available_summary_skips = 0;
  }

  return personalization;
}
