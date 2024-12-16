"use client";

import React, { createContext, useContext, useState } from 'react';
import type { Answer } from './types';

interface SurveyContextType {
  // Core functionality
  handleSurveyComplete: (answers: Answer[]) => Promise<void>;
  // Survey state
  isSubmitting: boolean;
  error: string | null;
  // Optional: progress saving
  savedAnswers: Answer[];
  saveProgress: (answers: Answer[]) => Promise<void>;
}

interface SurveyProviderProps {
  children: React.ReactNode;
  onSurveyComplete: (answers: Answer[]) => Promise<void>;
  onSaveProgress?: (answers: Answer[]) => Promise<void>;
  initialAnswers?: Answer[];
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ 
  children, 
  onSurveyComplete,
  onSaveProgress,
  initialAnswers = []
}: SurveyProviderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Answer[]>(initialAnswers);

  const handleSurveyComplete = async (answers: Answer[]) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSurveyComplete(answers);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit survey');
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveProgress = async (answers: Answer[]) => {
    if (!onSaveProgress) return;

    try {
      await onSaveProgress(answers);
      setSavedAnswers(answers);
    } catch (e) {
      console.error('Failed to save survey progress:', e);
    }
  };

  return (
    <SurveyContext.Provider 
      value={{ 
        handleSurveyComplete, 
        isSubmitting,
        error,
        savedAnswers,
        saveProgress
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}