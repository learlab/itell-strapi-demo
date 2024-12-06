"use client";
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from "@itell/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@itell/ui/select";

import surveyData from './outtake-survey-schema.json';
import { useSurvey } from './survey-context';

import type { 
  Question,
  Answer, 
  AnswerValue,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  GridQuestion,
  NumberInputQuestion,
  TextInputQuestion,
} from './survey-questions';


function isGridQuestion(question: Question): question is GridQuestion {
  return question.type === 'grid';
}
function isSingleChoiceQuestion(
  question: Question
): question is SingleChoiceQuestion {
  return question.type === 'single_choice' || question.type === 'true_false';
}

function isMultipleChoiceQuestion(
  question: Question
): question is MultipleChoiceQuestion {
  return question.type === 'multiple_choice';
}

function isTextInputQuestion(
  question: Question
): question is TextInputQuestion {
  return question.type === 'text_input';
}

function isNumberInputQuestion(
  question: Question
): question is NumberInputQuestion {
  return question.type === 'number_input';
}

type InstructionScreen = {
  id: string;
  type: 'instruction';
  content: string;
};

const instructionScreens: Record<string, InstructionScreen> = {
    start: {
      id: 'start',
      type: 'instruction',
      content: 'Please tell us about your experience with the textbook.'
    },
    end: {
      id: 'end',
      type: 'instruction',
      content: 'Thank you for completing the survey!'
    }
  };



export default function Survey() {
  const { handleSurveyComplete } = useSurvey();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showingInstruction, setShowingInstruction] = useState<string | null>('start');


  const section = surveyData.sections[currentSection];
  const question = section.questions[currentQuestion] as Question;

  const shouldDisplayQuestion = (q: any): boolean => {
    if (!q.display_condition) return true;

    const conditionAnswer = answers.find(
      a => a.questionId === q.display_condition.question_id
    )?.value;

    if (conditionAnswer === undefined) return true;

    switch (q.display_condition.operator) {
      case '!=':
        return conditionAnswer !== q.display_condition.value;
      case '==':
        return conditionAnswer === q.display_condition.value;
      default:
        return true;
    }
  };

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
    if (showingInstruction) return true;

    if (!shouldDisplayQuestion(question)) return true;
    const answer = getCurrentAnswer();
    if (answer === undefined) return false;

    if (question.type === 'grid') {
      const gridQuestion = question as GridQuestion;
      return gridQuestion.rows.every((_, index) => (answer as Record<number, string>)[index] !== undefined);
    }
    return true;
  };

  const renderInstructionScreen = (instructionId: string) => {
    const instruction = instructionScreens[instructionId];
    return (
      <div className="space-y-4">
        <p className="text-lg text-gray-600">{instruction.content}</p>
      </div>
    );
  };

  const renderGridQuestion = (question: any) => {
    const currentAnswer = (getCurrentAnswer() as Record<number, string>) || {};
    const columnCount = question.columns.length;
    const columnWidth = `${100 / (columnCount + 1)}%`;

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border w-1/4"></th>
              {question.columns.map((col: any, i: number) => (
                <th key={i} className="p-2 border text-center" style={{width: columnWidth}}>
                  {col.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                <td className="p-2 border font-medium">{row.text}</td>
                {question.columns.map((col: any, colIndex: number) => (
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
  const renderQuestion = () => {
    if (showingInstruction) {
      return renderInstructionScreen(showingInstruction);
    }

    if (!question || !shouldDisplayQuestion(question)) {
      return null;
    }
    const currentAnswer = getCurrentAnswer();

    if (isGridQuestion(question)) {
      return renderGridQuestion(question);
    }


    if (isSingleChoiceQuestion(question)) {
      return (
        <div className="space-y-4">
          {question.options.map((option, i) => (
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
    }

    if (isMultipleChoiceQuestion(question)) {
      const multiAnswer = (currentAnswer as number[]) || [];
      return (
        <div className="space-y-4">
          {question.options.map((option, i) => (
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
    }

    if (isTextInputQuestion(question) || isNumberInputQuestion(question)) {
      return (
        <input
          type={isNumberInputQuestion(question) ? 'number' : 'text'}
          onChange={(e) => handleAnswer(
            isNumberInputQuestion(question) ? 
              e.target.valueAsNumber || '' : 
              e.target.value
          )}
          value={
            Array.isArray(currentAnswer)
              ? currentAnswer.join(', ')
              : typeof currentAnswer === 'object'
              ? Object.values(currentAnswer).join(', ')
              : typeof currentAnswer === 'boolean'
              ? currentAnswer ? 'true' : 'false'
              : currentAnswer ?? ''
          }
          className="w-full p-4 border-2 rounded-lg"
          placeholder={isNumberInputQuestion(question) ? "Enter a number" : "Enter text"}
        />
      );
    }

    return null;
  };

  const findNextQuestion = (direction: 'next' | 'back'): { newSection: number; newQuestion: number } | null => {
    let newSection = currentSection;
    let newQuestion = direction === 'next' ? currentQuestion + 1 : currentQuestion - 1;

    const isEndOfSurvey = (section: number, question: number): boolean => {
      return section >= surveyData.sections.length || 
             (section === surveyData.sections.length - 1 && 
              question >= surveyData.sections[section].questions.length);
    };

    const isStartOfSurvey = (section: number, question: number): boolean => {
      return section < 0 || (section === 0 && question < 0);
    };

    while (!isEndOfSurvey(newSection, newQuestion) && !isStartOfSurvey(newSection, newQuestion)) {
      // Handle moving to next/previous section
      if (direction === 'next' && newQuestion >= surveyData.sections[newSection].questions.length) {
        newSection++;
        newQuestion = 0;
      } else if (direction === 'back' && newQuestion < 0) {
        newSection--;
        if (newSection >= 0) {
          newQuestion = surveyData.sections[newSection].questions.length - 1;
        }
      }

      // Check if we've gone too far in either direction
      if (isEndOfSurvey(newSection, newQuestion) || isStartOfSurvey(newSection, newQuestion)) {
        return null;
      }

      // If we find a question that should be displayed, return its position
      if (shouldDisplayQuestion(surveyData.sections[newSection].questions[newQuestion])) {
        return { newSection, newQuestion };
      }

      if (direction === 'next') {
        newQuestion++;
      } else {
        newQuestion--;
      }
    }

    return null;
  };

  const handleNavigation = (direction: 'next' | 'back') => {
    if (showingInstruction === 'start' && direction === 'next') {
      setShowingInstruction(null);
      return;
    }

    if (showingInstruction === 'end') {
      if (direction === 'next') {
        handleSurveyComplete(answers);
      } else {
        setShowingInstruction(null);
        return;
      }
    }

    const nextPosition = findNextQuestion(direction);

    if (!nextPosition) {
      if (direction === 'next') {
        handleSurveyComplete(answers);
        setShowingInstruction('end');
      }
      return;
    }

    setCurrentSection(nextPosition.newSection);
    setCurrentQuestion(nextPosition.newQuestion);
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
      {!showingInstruction && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${buttonBgColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          {!showingInstruction && (
            <>
              <h2 className="text-2xl font-bold text-gray-900">{section?.title}</h2>
              <p className="text-gray-600">{question?.text}</p>
            </>
          )}
        </div>
        <div className="min-h-[200px]">
          {renderQuestion()}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="ghost"
            onClick={() => handleNavigation('back')}
            disabled={currentSection === 0 && currentQuestion === 0 && showingInstruction === 'start'}
          >
            Back
          </Button>
          
          <Button
            onClick={() => handleNavigation('next')}
            disabled={!isQuestionAnswered()}
          >
            {showingInstruction === 'end' ? 'Submit' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}