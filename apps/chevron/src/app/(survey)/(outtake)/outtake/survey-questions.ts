
export interface Option {
  text: string;
  value: number;
}

export interface BaseQuestion {
  id: string;
  text: string;
  type: "single_choice" | "multiple_choice" | "number_input" | "true_false" | "grid";
  options?: Option[];
  correct_answer?: string;
  display_logic?: {
    depends_on: string;
    not_equals: string;
  };
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: "single_choice" | "true_false";
  options: Option[];
}
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple_choice";
  options: Option[];
}

export interface NumberInputQuestion extends BaseQuestion {
  type: "number_input";
}

export interface GridQuestion extends BaseQuestion {
  type: "grid";
  rows: string[];
  columns: string[];
}

export type Question = SingleChoiceQuestion | MultipleChoiceQuestion | NumberInputQuestion | GridQuestion;

export type AnswerValue = string | number | string[] | number[] | Record<number, string>;

export interface Answer {
  sectionId: string;
  questionId: string;
  value: AnswerValue;
}
export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface SurveyData {
  survey_name: string;
  sections: Section[];
}

