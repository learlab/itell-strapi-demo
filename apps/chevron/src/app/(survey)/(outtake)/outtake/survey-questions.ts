export type BaseQuestion = {
  id: string;
  text: string;
  required: boolean;
  display_condition?: string;
};

export type SingleChoiceQuestion = BaseQuestion & {
  type: 'single_choice';
  options: Array<{
    text: string;
    value: string | number;
  }>;
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: 'multiple_choice';
  options: Array<{
    text: string;
    value: number;
  }>;
};

export type TrueFalseQuestion = BaseQuestion & {
  type: 'true_false';
  options: Array<{
    text: string;
    value: boolean;
  }>;
};

export type NumberInputQuestion = BaseQuestion & {
  type: 'number_input';
};

export type TextInputQuestion = BaseQuestion & {
  type: 'text_input';
};

export type GridQuestion = BaseQuestion & {
  type: 'grid';
  rows: Array<{
    text: string;
    value: string;
  }>;
  columns: Array<{
    text: string;
    value: string;
  }>;
};

export type Question = 
  | SingleChoiceQuestion 
  | MultipleChoiceQuestion 
  | TrueFalseQuestion 
  | NumberInputQuestion 
  | TextInputQuestion 
  | GridQuestion;

export type Section = {
  id: string;
  title: string;
  questions: Question[];
};

export type Survey = {
  sections: Section[];
};

export type AnswerValue = 
  | string 
  | number 
  | boolean 
  | number[] 
  | Record<number, string>;

export type Answer = {
  sectionId: string;
  questionId: string;
  value: AnswerValue;
};