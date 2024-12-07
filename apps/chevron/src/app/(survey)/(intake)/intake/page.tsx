"use client";

import { SurveyProvider } from "@/components/survey-forms/survey-context";
import { validateAnswers } from '@/components/survey-forms/survey-validation';
import Survey from "./survey";
import { type Answer } from "@/components/survey-forms/types";

export default function IntakeSurveyPage() {
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
    try {
      const response = await fetch('/api/survey/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      // Clear saved progress after successful submission
      if (typeof window !== 'undefined') {
        localStorage.removeItem('intake-survey-progress');
      }
      
      // Handle successful submission here
      
    } catch (error) {
      console.error('Error submitting survey:', error);
      throw error;
    }
  };

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