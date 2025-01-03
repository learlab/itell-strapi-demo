import { cache } from "react";
import { surveys } from "#content";

import { routes } from "@/lib/navigation";
import { SurveySection } from "@/lib/survey";
import { SurveySubmission } from "./survey-question-renderer";

export type RouteParams = Parameters<typeof routes.surveySection>[0];

export const getSurvey = cache((surveyId: string) => {
  return surveys.find((survey) => survey.survey_id === surveyId);
});
export const getSurveySection = ({ surveyId, sectionId }: RouteParams) => {
  const survey = getSurvey(surveyId);
  if (!survey) {
    return null;
  }

  const section = survey.sections.find((section) => section.id === sectionId);
  return section;
};

export const getNextSectionId = ({
  sections,
  submission,
}: {
  // unfinished sections
  sections: SurveySection[];
  submission: SurveySubmission;
}) => {
  return (
    sections.find((section) => isSectionApplicable({ section, submission }))
      ?.id ?? null
  );
};

type Condition = NonNullable<SurveySection["display_rules"]>["conditions"][0];

export const isSectionApplicable = ({
  section,
  submission,
}: {
  section: SurveySection;
  submission: SurveySubmission;
}) => {
  if (!section.display_rules) {
    return true;
  }
  let ok = false;
  switch (section.display_rules.operator) {
    case "or":
      ok = section.display_rules.conditions.some((condition) =>
        matchCondition({ submission, condition })
      );
      break;
    case "and":
      ok = section.display_rules.conditions.every((condition) =>
        matchCondition({ submission, condition })
      );
      break;
    default:
      ok = false;
  }

  return ok;
};

// if user submission matches a single condition
const matchCondition = ({
  submission,
  condition,
}: {
  submission: SurveySubmission;
  condition: Condition;
}) => {
  if (!(condition.question_id in submission)) {
    return false;
  }

  const qdata = submission[condition.question_id];
  // NOTE: for now, only supports question data of type string or number
  // this means you can only set conditions for single choice, text input, numebr input
  if (typeof qdata == "string" || typeof qdata == "number") {
    switch (condition.operator) {
      case "eq":
        return qdata == condition.value;
      case "ne":
        return qdata != condition.value;
      default:
        return false;
    }
  }

  return false;
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
