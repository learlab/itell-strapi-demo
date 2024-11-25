import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { surveyData } from './survey-questions';

interface Answer {
  sectionId: string;
  questionId: string;
  answer: string | string[] | number | Record<number, string>;
}

export default function Survey() {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const section = surveyData.sections[currentSection];
  const question = section.questions[currentQuestion];

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === question.id)?.answer;
  };

  const handleAnswer = (answer: string | string[] | number | Record<number, string>) => {
    setAnswers(prev => {
      const newAnswer: Answer = {
        sectionId: section.id,
        questionId: question.id,
        answer
      };

      const existingIndex = prev.findIndex(a => a.questionId === question.id);
      if (existingIndex >= 0) {
        return prev.map((a, i) => i === existingIndex ? newAnswer : a);
      }
      return [...prev, newAnswer];
    });
  };

  const isQuestionAnswered = () => {
    const answer = answers.find(a => a.questionId === question.id)?.answer;
    if (!answer) return false;

    if (question.type === 'grid') {
      return question.rows?.every((_, index) => (answer as Record<number, string>)[index]);
    }
    return true;
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'single_choice':
      case 'true_false':
        return (
          <div className="space-y-4">
            {question.options?.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option.text)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all
                  ${getCurrentAnswer() === option.text 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                {option.text}
              </button>
            ))}
          </div>
        );

      case 'multiple_choice':
        const multiAnswer = (getCurrentAnswer() as string[]) || [];
        return (
          <div className="space-y-4">
            {question.options?.map((option, i) => (
              <button
                key={i}
                onClick={() => {
                  const newAnswer = multiAnswer.includes(option.text)
                    ? multiAnswer.filter(a => a !== option.text)
                    : [...multiAnswer, option.text];
                  handleAnswer(newAnswer);
                }}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all
                  ${multiAnswer.includes(option.text)
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                {option.text}
              </button>
            ))}
          </div>
        );

      case 'number_input':
        return (
          <input
            type="number"
            onChange={(e) => handleAnswer(e.target.valueAsNumber)}
            value={getCurrentAnswer() || ''}
            className="w-full p-4 border-2 rounded-lg"
            placeholder="Enter a number"
          />
        );

      case 'grid':
        const gridAnswer = (getCurrentAnswer() as Record<number, string>) || {};
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border-b-2"></th>
                  {question.columns?.map((col, i) => (
                    <th key={i} className="p-3 border-b-2 text-sm text-center">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="p-3 border-b font-medium">{row}</td>
                    {question.columns?.map((col, colIndex) => (
                      <td key={colIndex} className="p-3 border-b text-center">
                        <button
                          onClick={() => {
                            const newGridAnswer = {
                              ...gridAnswer,
                              [rowIndex]: col
                            };
                            handleAnswer(newGridAnswer);
                          }}
                          className={`w-4 h-4 rounded-full border-2 transition-all
                            ${gridAnswer[rowIndex] === col 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
          <p className="text-gray-600">{question.text}</p>
        </div>

        {renderQuestion()}

        <div className="flex justify-between pt-4">
          <button
            onClick={() => handleNavigation('back')}
            disabled={currentSection === 0 && currentQuestion === 0}
            className="px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => handleNavigation('next')}
            disabled={!isQuestionAnswered()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 
                     hover:bg-blue-700 flex items-center gap-2"
          >
            {currentSection === surveyData.sections.length - 1 && 
             currentQuestion === section.questions.length - 1 ? 'Submit' : 'Next'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}