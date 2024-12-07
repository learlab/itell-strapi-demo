"use client";

import { useSurvey } from '@/components/survey-forms/survey-context';
import { useSurveyNavigation } from '@/components/survey-forms/use-survey-navigation';
import { SurveyLayout } from '@/components/survey-forms/survey-layout';
import {validateSurveyData} from '@/components/survey-forms/survey-validation';
import rawSurveyData from './outtake-survey-schema.json';

const INSTRUCTIONS = {
  start: "Please tell us about your experience with the textbook.",
  end: "Thank you for completing the survey!"
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

  const isQuestionAnswered = () => {
    if (showingInstruction) return true;
    if (!shouldDisplayQuestion(question)) return true;
    if (currentAnswer === undefined) return false;
    
    if (question.type === 'grid') {
      return Object.keys(currentAnswer as Record<number, string>).length === question.rows.length;
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
    />
  );
}