"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";

import { QuestionRenderer } from "@/components/survey-forms/questions";
import { useSurvey } from "@/components/survey-forms/survey-context";
import { SurveyLayout } from "@/components/survey-forms/survey-layout";
import { useSurveyNavigation } from "@/components/survey-forms/use-survey-navigation";
import { isSingleChoiceQuestion } from "@/components/survey-forms/utils";
import { validateSurveyData } from "@/components/survey-forms/survey-validation";
import rawSurveyData from "./intake-survey-schema.json";

const INSTRUCTIONS = {
  start:
    "Now, please tell us a little bit about yourself, and your access to technologies and the internet.",
  end: "Thank you for filling out the survey!",
};

export default function Survey() {
    const surveyData = validateSurveyData(rawSurveyData);
  const { handleSurveyComplete } = useSurvey();
  const {
    section,
    question,
    showingInstruction,
    progress,
    currentAnswer,
    handleAnswer,
    handleNavigation,
    shouldDisplayQuestion,
  } = useSurveyNavigation({
    surveyData,
    onComplete: handleSurveyComplete,
  });

  const renderQuestion = () => {
    // Special case for country selection in intake
    if (isSingleChoiceQuestion(question) && question.id === "demo_country") {
      return (
        <Select
          value={currentAnswer?.toString()}
          onValueChange={(value) => handleAnswer(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your country of birth" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {question.options.map((option) => (
              <SelectItem
                key={`${question.id}-${option.value}`}
                value={option.value.toString()}
              >
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <QuestionRenderer
        question={question}
        currentAnswer={currentAnswer}
        onAnswer={handleAnswer}
      />
    );
  };

  const isQuestionAnswered = () => {
    if (showingInstruction) return true;
    if (!shouldDisplayQuestion(question)) return true;
    if (currentAnswer === undefined) return false;

    if (question.type === "grid") {
      return (
        Object.keys(currentAnswer as Record<number, string>).length ===
        question.rows.length
      );
    }
    return true;
  };

  return (
    <SurveyLayout
      section={section}
      question={question}
      showingInstruction={showingInstruction}
      progress={progress}
      currentAnswer={currentAnswer}
      instruction={INSTRUCTIONS}
      onAnswer={handleAnswer}
      onNavigation={handleNavigation}
      isFirstQuestion={section?.id === surveyData.sections[0].id}
      isQuestionAnswered={isQuestionAnswered()}
      renderQuestion={renderQuestion}
    />
  );
}
