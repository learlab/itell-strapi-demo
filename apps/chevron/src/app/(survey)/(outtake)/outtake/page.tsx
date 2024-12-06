"use client";
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from "@itell/ui/button";
import surveyData from './outtake-survey-schema.json';
import { 
  Question, 
  Answer, 
  AnswerValue, 
  GridQuestion,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  Survey
} from './survey-questions';

export default function OuttakeSurvey() {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const typedSurveyData = surveyData as Survey;
  const section = typedSurveyData.sections[currentSection];
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

    if (question.type === 'grid') {
      const gridQuestion = question as GridQuestion;
      return gridQuestion.rows.every((_, index) => (answer as Record<number, string>)[index] !== undefined);
    }
    return true;
  };

  const renderGridQuestion = (question: GridQuestion) => {
    const currentAnswer = (getCurrentAnswer() as Record<number, string>) || {};

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border"></th>
              {question.columns.map((col, i) => (
                <th key={i} className="p-2 border text-center">
                  {col.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 border font-medium">{row.text}</td>
                {question.columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-2 border text-center">
                    <Button
                      variant={currentAnswer[rowIndex] === col.value ? "default" : "outline"}
                      onClick={() => {
                        const newAnswer = { ...currentAnswer, [rowIndex]: col.value };
                        handleAnswer(newAnswer);
                      }}
                      className="w-full"
                    >
                      {col.value}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };



  const renderMultipleChoiceQuestion = (question: MultipleChoiceQuestion) => {
    const currentAnswer = (getCurrentAnswer() as number[]) || [];
    return (
      <div className="space-y-4">
        {question.options.map((option, i) => (
          <Button
            key={i}
            onClick={() => {
              const newAnswer = currentAnswer.includes(option.value)
                ? currentAnswer.filter(a => a !== option.value)
                : [...currentAnswer, option.value];
              handleAnswer(newAnswer);
            }}
            variant={currentAnswer.includes(option.value) ? "default" : "outline"}
            className="w-full justify-start h-auto py-4"
          >
            {option.text}
          </Button>
        ))}
      </div>
    );
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'grid':
        return renderGridQuestion(question);

      case 'single_choice':
      case 'true_false':
        return (
          <div className="space-y-4">
            {question.options?.map((option, i) => (
              <Button
                key={i}
                onClick={() => handleAnswer(option.value)}
                variant={getCurrentAnswer() === option.value ? "default" : "outline"}
                className="w-full justify-start h-auto py-4"
              >
                {option.text}
              </Button>
            ))}
          </div>
        );

      case 'multiple_choice':
        return renderMultipleChoiceQuestion(question);

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
              Array.isArray(getCurrentAnswer())
                ? (getCurrentAnswer() as number[]).join(', ')
                : typeof getCurrentAnswer() === 'boolean'
                ? getCurrentAnswer()?.toString() ?? ''
                : (getCurrentAnswer() as string | number) ?? ''
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
      } else if (currentSection < typedSurveyData.sections.length - 1) {
        setCurrentSection(prev => prev + 1);
        setCurrentQuestion(0);
      }
    } else {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      } else if (currentSection > 0) {
        setCurrentSection(prev => prev - 1);
        setCurrentQuestion(typedSurveyData.sections[currentSection - 1].questions.length - 1);
      }
    }
  };

  const totalQuestions = typedSurveyData.sections.reduce((acc, section) => acc + section.questions.length, 0);
  const questionsAnswered = typedSurveyData.sections.slice(0, currentSection)
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
            {currentSection === typedSurveyData.sections.length - 1 && 
             currentQuestion === section.questions.length - 1 ? 'Submit' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}