// Option types
export interface Option {
    text: string;
    value: string | number | boolean;
  }
  
  export interface DisplayCondition {
    question_id: string;
    operator: '==' | '!=' | '>';
    value: string | number | boolean;
  }
  
  // Base Question type
  export interface BaseQuestion {
    id: string;
    text: string;
    type: 'single_choice' | 'multiple_choice' | 'number_input' | 'text_input' | 'grid' | 'true_false';
    required: boolean;
    display_condition?: DisplayCondition;
  }
  
  // Specific Question types
  export interface SingleChoiceQuestion extends BaseQuestion {
    type: 'single_choice';
    options: Option[];
  }
  
  export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple_choice';
    options: Option[];
  }
  
  export interface NumberInputQuestion extends BaseQuestion {
    type: 'number_input';
  }
  
  export interface TextInputQuestion extends BaseQuestion {
    type: 'text_input';
  }
  
  export interface GridQuestion extends BaseQuestion {
    type: 'grid';
    rows: Array<{ text: string; value: string }>;
    columns: Array<{ text: string; value: string }>;
  }

  export interface TrueFalseQuestion extends BaseQuestion {
    type: 'true_false';
  }
  
  // Union type for all questions
  export type Question =
    | SingleChoiceQuestion
    | TrueFalseQuestion
    | MultipleChoiceQuestion
    | NumberInputQuestion
    | TextInputQuestion
    | GridQuestion;
  
  // Answer types
  export type AnswerValue =
    | string
    | number
    | boolean
    | number[]
    | Record<number, string>;
  
  export interface Answer {
    sectionId: string;
    questionId: string;
    value: AnswerValue;
  }
  
  // Section and Survey types
  export interface Section {
    id: string;
    title: string;
    questions: Question[];
  }
  
  export interface Survey {
    survey_name: string;
    sections: Section[];
  }
  
  // Type guard for checking question types
  export function isSingleChoiceQuestion(question: Question): question is SingleChoiceQuestion {
    return question.type === 'single_choice';
  }
  
  export function isMultipleChoiceQuestion(question: Question): question is MultipleChoiceQuestion {
    return question.type === 'multiple_choice';
  }
  
  export function isGridQuestion(question: Question): question is GridQuestion {
    return question.type === 'grid';
  }
  
  export function isNumberInputQuestion(question: Question): question is NumberInputQuestion {
    return question.type === 'number_input';
  }
  
  export function isTextInputQuestion(question: Question): question is TextInputQuestion {
    return question.type === 'text_input';
  }