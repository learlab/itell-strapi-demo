"use client";
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from "@itell/ui/button";
import surveyData from './outtake-survey-schema.json';
import { Answer, AnswerValue } from './survey-questions';

export default function Survey() {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const section = surveyData.sections[currentSection];
  const question = section.questions[currentQuestion];

  const getCurrentAnswer = (): AnswerValue | undefined => {
    return answers.find(a => a.questionId === question.id)?.value;
  };

  const handleAnswer = (value: AnswerValue) => {
    setAnswers(prev => {
      const newAnswer: Answer = {
        sectionId: section.id,
        questionId: question.id,
        value
      };

      const existingIndex = prev.findIndex(a => a.questionId === question.id);
      if (existingIndex >= 0) {
        return prev.map((a, i) => i === existingIndex ? newAnswer : a);
      }
      return [...prev, newAnswer];
    });
  };

  const isQuestionAnswered = (): boolean => {
    const answer = getCurrentAnswer();
    if (answer === undefined) return false;

    if (question.type === 'grid' && 'rows' in question && Array.isArray(question.rows)) {
      return question.rows.every((_: any, index: number) => (answer as Record<number, string>)[index]);
    }
    return true;
  };

  const renderQuestion = () => {
    const currentAnswer = getCurrentAnswer();

    switch (question.type) {
      case 'single_choice':
      case 'true_false':
        return (
          <div className="space-y-4">
            {question.options?.map((option, i) => (
              <Button
                key={i}
                onClick={() => handleAnswer(option.value)}
                variant={currentAnswer === option.value ? "default" : "outline"}
                className="w-full justify-start h-auto py-4"
              >
                {option.text}
              </Button>
            ))}
          </div>
        );

      case 'multiple_choice':
        const multiAnswer = (currentAnswer as number[]) || [];
        return (
          <div className="space-y-4">
            {question.options?.map((option, i) => (
              <Button
                key={i}
                onClick={() => {
                  const newAnswer = multiAnswer.includes(option.value)
                    ? multiAnswer.filter(a => a !== option.value)
                    : [...multiAnswer, option.value];
                  handleAnswer(newAnswer);
                }}
                variant={multiAnswer.includes(option.value) ? "default" : "outline"}
                className="w-full justify-start h-auto py-4"
              >
                {option.text}
              </Button>
            ))}
          </div>
        );

      case 'number_input':
      case 'text_input':
        return (
          <input
            type={question.type === 'number_input' ? 'number' : 'text'}
            onChange={(e) => handleAnswer(
              question.type === 'number_input' ? 
                e.target.valueAsNumber || '' : 
                e.target.value
            )}
            value={
              Array.isArray(currentAnswer)
                ? currentAnswer.join(', ')
                : typeof currentAnswer === 'object'
                ? Object.values(currentAnswer).join(', ')
                : currentAnswer ?? ''
            }
            className="w-full p-4 border-2 rounded-lg"
            placeholder={question.type === 'number_input' ? "Enter a number" : "Enter text"}
          />
        );
    }
  };

  const handleNavigation = (direction: 'next' | 'back') => {
    if (direction === 'next') {
      if (currentQuestion < section.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else if (currentSection < surveyData.sections.length - 1) {
        setCurrentSection(prev => prev + 1);
        setCurrentQuestion(0);
      }
    } else {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      } else if (currentSection > 0) {
        setCurrentSection(prev => prev - 1);
        setCurrentQuestion(surveyData.sections[currentSection - 1].questions.length - 1);
      }
    }
  };

  const totalQuestions = surveyData.sections.reduce((acc, section) => acc + section.questions.length, 0);
  const questionsAnswered = surveyData.sections.slice(0, currentSection)
    .reduce((acc, section) => acc + section.questions.length, 0) + currentQuestion + 1;
  const progress = (questionsAnswered / totalQuestions) * 100;

  const buttonStyle = buttonVariants({ variant: "default" });
  const bgColorMatch = buttonStyle.match(/bg-([^\s]+)/);
  const buttonBgColor = bgColorMatch ? bgColorMatch[0] : 'bg-primary';

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${buttonBgColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
          <p className="text-gray-600">{question.text}</p>
        </div>
        <div className="min-h-[200px]">
        {renderQuestion()}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="ghost"
            onClick={() => handleNavigation('back')}
            disabled={currentSection === 0 && currentQuestion === 0}
          >
            Back
          </Button>
          
          <Button
            onClick={() => handleNavigation('next')}
            disabled={!isQuestionAnswered()}
          >
            {currentSection === surveyData.sections.length - 1 && 
             currentQuestion === section.questions.length - 1 ? 'Submit' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}