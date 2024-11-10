import { PersonalizationData } from "@/drizzle/schema";

export function handleSummaryStreak(personalizationData: PersonalizationData, isPassed: boolean): PersonalizationData {
  personalizationData = personalizationData || {};

  personalizationData.skip_summary_number = isPassed ? 1 : 0;

  let newSummaryStreak = isPassed ? (personalizationData.summary_streak || 0) + 1 : 0;

  if (newSummaryStreak > (personalizationData.max_summary_streak || 0)) {
    personalizationData.max_summary_streak = newSummaryStreak;
  }

  personalizationData.summary_streak = newSummaryStreak;

  return personalizationData;
}