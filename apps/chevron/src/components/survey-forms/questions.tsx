// components/survey/questions.tsx

import { Button } from "@itell/ui/button";
import type { Question, Answer, AnswerValue } from './types';
import { 
  isGridQuestion,
  isSingleChoiceQuestion,
  isMultipleChoiceQuestion,
  isTextInputQuestion,
  isNumberInputQuestion
} from './utils';

interface QuestionProps {
  question: Question;
  currentAnswer?: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
}

export const GridQuestion: React.FC<QuestionProps> = ({ question, currentAnswer, onAnswer }) => {
  if (!isGridQuestion(question)) return null;
  
  const answer = (currentAnswer as Record<number, string>) || {};
  const columnCount = question.columns.length;
  const columnWidth = `${100 / (columnCount + 1)}%`;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border w-1/4"></th>
            {question.columns.map((col, i) => (
              <th key={i} className="p-2 border text-center" style={{width: columnWidth}}>
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
                    variant={answer[rowIndex] === col.value ? "default" : "outline"}
                    onClick={() => {
                      const newAnswer = { ...answer, [rowIndex]: col.value };
                      onAnswer(newAnswer);
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

export const SingleChoiceQuestion: React.FC<QuestionProps> = ({ question, currentAnswer, onAnswer }) => {
  if (!isSingleChoiceQuestion(question)) return null;

  return (
    <div className="space-y-4">
      {question.options.map((option, i) => (
        <Button
          key={i}
          onClick={() => onAnswer(option.value)}
          variant={currentAnswer === option.value ? "default" : "outline"}
          className="w-full justify-start h-auto py-4"
        >
          {option.text}
        </Button>
      ))}
    </div>
  );
};

export const MultipleChoiceQuestion: React.FC<QuestionProps> = ({ question, currentAnswer, onAnswer }) => {
  if (!isMultipleChoiceQuestion(question)) return null;

  const multiAnswer = (currentAnswer as number[]) || [];
  
  return (
    <div className="space-y-4">
      {question.options.map((option, i) => (
        <Button
          key={i}
          onClick={() => {
            const newAnswer = multiAnswer.includes(option.value as number)
              ? multiAnswer.filter(a => a !== option.value)
              : [...multiAnswer, option.value as number];
            onAnswer(newAnswer);
          }}
          variant={multiAnswer.includes(option.value as number) ? "default" : "outline"}
          className="w-full justify-start h-auto py-4"
        >
          {option.text}
        </Button>
      ))}
    </div>
  );
};

export const InputQuestion: React.FC<QuestionProps> = ({ question, currentAnswer, onAnswer }) => {
  if (!isTextInputQuestion(question) && !isNumberInputQuestion(question)) return null;

  const isNumber = isNumberInputQuestion(question);
  
  return (
    <input
      type={isNumber ? 'number' : 'text'}
      onChange={(e) => onAnswer(
        isNumber ? 
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
      placeholder={isNumber ? "Enter a number" : "Enter text"}
    />
  );
};

export const QuestionRenderer: React.FC<QuestionProps> = (props) => {
  const { question } = props;

  if (isGridQuestion(question)) {
    return <GridQuestion {...props} />;
  }

  if (isSingleChoiceQuestion(question)) {
    return <SingleChoiceQuestion {...props} />;
  }

  if (isMultipleChoiceQuestion(question)) {
    return <MultipleChoiceQuestion {...props} />;
  }

  if (isTextInputQuestion(question) || isNumberInputQuestion(question)) {
    return <InputQuestion {...props} />;
  }

  return null;
};