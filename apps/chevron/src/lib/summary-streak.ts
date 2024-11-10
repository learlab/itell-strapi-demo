import { PersonalizationData } from "@/drizzle/schema";

export function handleSummaryStreak(personalizationData: PersonalizationData, isPassed: boolean): PersonalizationData {
  personalizationData = personalizationData || {};

  // increment streak count by one if summary is a passing one
  let newSummaryStreak = isPassed ? (personalizationData.summary_streak || 0) + 1 : 0;

  // update max streak count
  if (newSummaryStreak > (personalizationData.max_summary_streak || 0)) {
    personalizationData.max_summary_streak = newSummaryStreak;
  }

  personalizationData.summary_streak = newSummaryStreak;

  // every new passing summary after a streak allows user to skip one summary
  if (isPassed && newSummaryStreak >= 2) {
    personalizationData.skip_summary_number = 1;
  } else {
    personalizationData.skip_summary_number = 0;
  }

  return personalizationData;
}