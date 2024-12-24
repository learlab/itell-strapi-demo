import Form from "next/form";
import { notFound, redirect } from "next/navigation";
import { Button } from "@itell/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Input } from "@itell/ui/input";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { ChevronRight } from "lucide-react";

import { routes } from "@/lib/navigation";
import { getNextSection, getSurvey, getSurveySection } from "./data";
import { SurveyHeader } from "./survey-header";
import { SurveyQuestionRenderer } from "./survey-question-renderer";

export default async function SurveyQuestionPage(props: {
  params: Promise<unknown>;
}) {
  const params = routes.surveySection.$parseParams(await props.params);
  const survey = getSurvey(params.surveyId);
  const section = getSurveySection(params);
  if (!section || !survey) {
    return notFound();
  }

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
        <Form
          className="flex flex-col gap-8"
          action={async (formData: FormData) => {
            "use server";
            console.log("formdata", Object.fromEntries(formData));
            const nextSection = getNextSection(params);
            if (nextSection) {
              redirect(
                routes.surveySection({
                  surveyId: params.surveyId,
                  sectionId: nextSection.id,
                })
              );
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
                <SurveyQuestionRenderer key={question.id} question={question} />
              </CardContent>
            </Card>
          ))}

          <footer className="flex items-center justify-between">
            <ForwardButton
              text={
                sectionIdx === survey.sections.length - 1
                  ? "Save"
                  : "Save and Next"
              }
            />
          </footer>
        </Form>
      </div>
    </div>
  );
}

function ForwardButton({ text }: { text: string }) {
  return (
    <Button type="submit" size={"lg"} className="ml-auto gap-1">
      <span>Save and Next</span>
      <ChevronRight />
    </Button>
  );
}
