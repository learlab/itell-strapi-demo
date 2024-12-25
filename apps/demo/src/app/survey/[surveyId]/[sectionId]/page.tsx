import Form from "next/form";
import { notFound, redirect } from "next/navigation";
import { Errorbox } from "@itell/ui/callout";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";

import {
  getSurveySessionAction,
  upsertSurveySessionAction,
} from "@/actions/survey";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { getNextSection, getSurvey, getSurveySection } from "./data";
import { SurveyHeader } from "./survey-header";
import {
  SurveyQuestionData,
  SurveyQuestionRenderer,
} from "./survey-question-renderer";
import { SurveySubmitButton } from "./survey-submit-button";

export default async function SurveyQuestionPage(props: {
  params: Promise<unknown>;
}) {
  const { user } = await getSession();
  const params = routes.surveySection.$parseParams(await props.params);
  if (!user) {
    return redirect(
      routes.surveySection({
        surveyId: params.surveyId,
        sectionId: params.sectionId,
      })
    );
  }

  const survey = getSurvey(params.surveyId);
  const section = getSurveySection(params);
  if (!section || !survey) {
    return notFound();
  }

  const [session, err] = await getSurveySessionAction({
    surveyId: params.surveyId,
    sectionId: section.id,
  });

  const sectionIdx = survey.sections.findIndex(
    (section) => section.id === params.sectionId
  );

  return (
    <div className="flex min-h-[100vh] flex-col">
      <SurveyHeader
        surveyId={params.surveyId}
        surveyTitle={survey.survey_name}
        sectionTitle={section.title}
      />
      <div className="w-full flex-1 bg-muted p-6">
        {err && (
          <Errorbox>
            Failed to get your submission history, you need to re-fill this
            page.
          </Errorbox>
        )}
        <Form
          className="flex flex-col gap-8"
          action={async (formData: FormData) => {
            "use server";
            const sectionData = await formDataToSectionJson(section, formData);
            await upsertSurveySessionAction({
              surveyId: params.surveyId,
              sectionId: section.id,
              isFinished: sectionIdx === survey.sections.length - 1,
              data: sectionData,
            });

            const nextSection = getNextSection(params);
            if (nextSection) {
              redirect(
                routes.surveySection({
                  surveyId: params.surveyId,
                  sectionId: nextSection.id,
                })
              );
            }

            if (sectionIdx === survey.sections.length - 1) {
              redirect(routes.home());
            }
          }}
        >
          {section.questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle>
                  <legend className="text-lg font-medium tracking-tight xl:text-xl">
                    {question.text}
                  </legend>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SurveyQuestionRenderer
                  key={question.id}
                  question={question}
                  sessionData={session?.sectionData?.[question.id]}
                />
              </CardContent>
            </Card>
          ))}

          <footer className="flex items-center justify-between">
            <div className="ml-auto">
              <SurveySubmitButton
                isLastPage={sectionIdx === survey.sections.length - 1}
              />
            </div>
          </footer>
        </Form>
      </div>
    </div>
  );
}

async function formDataToSectionJson(
  section: ReturnType<typeof getSurveySection>,
  formData: FormData
) {
  if (!section) {
    return {};
  }
  const output: Record<string, SurveyQuestionData> = {};
  const entries = Array.from(formData.entries());
  section.questions.forEach((question) => {
    switch (question.type) {
      case "single_select":
      case "number_input":
      case "text_input":
      case "single_choice":
        output[question.id] = String(formData.get(question.id));
        break;
      case "multiple_select":
        output[question.id] = JSON.parse(
          String(formData.get(question.id))
        ) as Array<{ value: string; label: string }>;
        break;
      case "toggle_group":
      case "multiple_choice":
        console.log("output for toggle group is", Object.fromEntries(entries));
        entries.forEach(([key, value]) => {
          if (!key.startsWith(`${question.id}--`)) {
            return;
          }
          if (!output[question.id]) {
            output[question.id] = [] as string[];
          }
          (output[question.id] as Array<string>).push(String(value));
        });
        break;
      case "grid":
        entries.forEach(([key, value]) => {
          if (!key.startsWith(`${question.id}--`)) {
            return;
          }
          if (!output[question.id]) {
            output[question.id] = {} as Record<string, string>;
          }

          const group = key.split("--")[1] as string;
          (output[question.id] as Record<string, string>)[group] =
            String(value);
        });
        break;
    }
  });

  return output;
}
