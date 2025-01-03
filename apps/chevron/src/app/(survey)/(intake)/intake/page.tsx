"use client";

import { SurveyProvider } from "@/components/survey-forms/survey-context";
import { validateAnswers } from '@/components/survey-forms/survey-validation';
import Survey from "./survey";
import { type Answer } from "@/components/survey-forms/types";
import { createSurveyAction } from "@/actions/surveys";
import { useServerAction } from "zsa-react";
import { useRouter } from 'next/navigation';
import { firstPage } from "@/lib/pages/pages.server";
import { toast } from "sonner";
import { reportSentry } from "@/lib/utils";

export default function IntakeSurveyPage() {
  const { isPending, execute, isError, error } = useServerAction(createSurveyAction);
  const router = useRouter();
  // Load and validate saved progress
  const savedProgress = (() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('intake-survey-progress');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return validateAnswers(parsed);
    } catch (error) {
      console.error('Error loading saved progress:', error);
      return [];
    }
  })();

  const handleSurveyComplete = async (answers: Answer[]) => {
    const [_, err] = await execute({ surveyType:"intake", data: answers});  
    router.push('/');
      if (isError) {
        toast.error("Error with consent.");
        reportSentry("consent", { error });
    }
    // Clear saved progress after successful submission
    if (typeof window !== 'undefined') {
      localStorage.removeItem('intake-survey-progress');
    }
    
  } 


  const handleSaveProgress = async (answers: Answer[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'intake-survey-progress',
          JSON.stringify(answers)
        );
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  return (
    <SurveyProvider 
      onSurveyComplete={handleSurveyComplete}
      onSaveProgress={handleSaveProgress}
      initialAnswers={savedProgress}
    >
      <Survey />
    </SurveyProvider>
  );
}