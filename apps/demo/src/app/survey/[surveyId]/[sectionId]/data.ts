import { cache } from "react";
import { surveys } from "#content";

import { routes } from "@/lib/navigation";

export type RouteParams = Parameters<typeof routes.surveySection>[0];

export const getSurvey = cache((surveyId: string) => {
  return surveys.find((survey) => survey.survey_id === surveyId);
});
export const getSurveySection = cache(
  ({ surveyId, sectionId }: RouteParams) => {
    const survey = getSurvey(surveyId);
    if (!survey) {
      return null;
    }

    const section = survey.sections.find((section) => section.id === sectionId);
    return section;
  }
);

export const getNextSection = ({ surveyId, sectionId }: RouteParams) => {
  const survey = getSurvey(surveyId);
  if (!survey) {
    return null;
  }
  const sectionIndex = survey.sections.findIndex(
    (section) => section.id === sectionId
  );

  if (sectionIndex + 1 < survey.sections.length) {
    return survey.sections[sectionIndex + 1];
  }

  return null;
};

export const getPreviousSection = ({ surveyId, sectionId }: RouteParams) => {
  const survey = getSurvey(surveyId);
  if (!survey) {
    return null;
  }
  const sectionIndex = survey.sections.findIndex(
    (section) => section.id === sectionId
  );

  if (sectionIndex > 0) {
    return survey.sections[sectionIndex - 1];
  }

  return null;
};
