"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import type { Answer } from './survey-questions';

interface SurveyContextType {
  handleSurveyComplete: (answers: Answer[]) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

interface SurveyProviderProps {
  children: ReactNode;
  onSurveyComplete: (answers: Answer[]) => void;
}

export function SurveyProvider({ children, onSurveyComplete }: SurveyProviderProps) {
  const handleSurveyComplete = (answers: Answer[]) => {
    onSurveyComplete(answers);
  };

  return (
    <SurveyContext.Provider value={{ handleSurveyComplete }}>
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