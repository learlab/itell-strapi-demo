import { useState } from "react";
import type { Survey, Answer, Question } from "./types";

interface UseSurveyNavigationProps {
  surveyData: Survey;
  onComplete: (answers: Answer[]) => void;
}

export function useSurveyNavigation({ surveyData, onComplete }: UseSurveyNavigationProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showingInstruction, setShowingInstruction] = useState<string | null>("start");

  const section = surveyData.sections[currentSection];
  const question = section?.questions[currentQuestion] as Question;

  const shouldDisplayQuestion = (q: Question): boolean => {
    if (!q.display_condition) return true;

    const conditionAnswer = answers.find(
      (a) => a.questionId === q.display_condition?.question_id
    )?.value;

    if (conditionAnswer === undefined) return true;

    switch (q.display_condition.operator) {
      case "!=":
        return conditionAnswer !== q.display_condition.value;
      case "==":
        return conditionAnswer === q.display_condition.value;
      default:
        return true;
    }
  };

  const getCurrentAnswer = () => {
    return answers.find((a) => a.questionId === question?.id)?.value;
  };

  const handleAnswer = (value: Answer["value"]) => {
    setAnswers((prev) => {
      const newAnswer: Answer = {
        sectionId: section.id,
        questionId: question.id,
        value,
      };

      const existingIndex = prev.findIndex((a) => a.questionId === question.id);
      if (existingIndex >= 0) {
        return prev.map((a, i) => (i === existingIndex ? newAnswer : a));
      }
      return [...prev, newAnswer];
    });
  };

  const findNextQuestion = (
    direction: "next" | "back"
  ): { newSection: number; newQuestion: number } | null => {
    let newSection = currentSection;
    let newQuestion =
      direction === "next" ? currentQuestion + 1 : currentQuestion - 1;

    const isEndOfSurvey = (section: number, question: number): boolean => {
      return (
        section >= surveyData.sections.length ||
        (section === surveyData.sections.length - 1 &&
          question >= surveyData.sections[section].questions.length)
      );
    };

    const isStartOfSurvey = (section: number, question: number): boolean => {
      return section < 0 || (section === 0 && question < 0);
    };

    while (
      !isEndOfSurvey(newSection, newQuestion) &&
      !isStartOfSurvey(newSection, newQuestion)
    ) {
      if (
        direction === "next" &&
        newQuestion >= surveyData.sections[newSection].questions.length
      ) {
        newSection++;
        newQuestion = 0;
      } else if (direction === "back" && newQuestion < 0) {
        newSection--;
        if (newSection >= 0) {
          newQuestion = surveyData.sections[newSection].questions.length - 1;
        }
      }

      if (isEndOfSurvey(newSection, newQuestion) || isStartOfSurvey(newSection, newQuestion)) {
        return null;
      }

      if (shouldDisplayQuestion(surveyData.sections[newSection].questions[newQuestion])) {
        return { newSection, newQuestion };
      }

      if (direction === "next") {
        newQuestion++;
      } else {
        newQuestion--;
      }
    }

    return null;
  };

  const handleNavigation = (direction: "next" | "back") => {
    if (showingInstruction === "start" && direction === "next") {
      setShowingInstruction(null);
      return;
    }

    if (showingInstruction === "end") {
      if (direction === "next") {
        onComplete(answers);
      } else {
        setShowingInstruction(null);
        return;
      }
    }

    const nextPosition = findNextQuestion(direction);

    if (!nextPosition) {
      if (direction === "next") {
        onComplete(answers);
        setShowingInstruction("end");
      }
      return;
    }

    setCurrentSection(nextPosition.newSection);
    setCurrentQuestion(nextPosition.newQuestion);
  };

  const progress = (() => {
    const totalQuestions = surveyData.sections.reduce(
      (acc, section) => acc + section.questions.length,
      0
    );
    const questionsAnswered =
      surveyData.sections
        .slice(0, currentSection)
        .reduce((acc, section) => acc + section.questions.length, 0) +
      currentQuestion +
      1;
    return (questionsAnswered / totalQuestions) * 100;
  })();

  return {
    section,
    question,
    showingInstruction,
    progress,
    currentAnswer: getCurrentAnswer(),
    handleAnswer,
    handleNavigation,
    shouldDisplayQuestion,
  };
}