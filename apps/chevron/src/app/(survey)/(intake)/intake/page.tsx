"use client";
import  Survey from './survey';
import { SurveyProvider } from './survey-context';
import type { Answer } from './survey-questions';

export default function IntakeSurveyPage() {
  const handleSurveyComplete = (answers: Answer[]) => {
    // Handle the survey completion here
    console.log('Survey completed:', answers);
  };

  return (
    <SurveyProvider onSurveyComplete={handleSurveyComplete}>
      <Survey />
    </SurveyProvider>
  );
}