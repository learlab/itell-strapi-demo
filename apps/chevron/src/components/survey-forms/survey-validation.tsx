import type { Survey, Question, Section, Option, DisplayCondition, Answer, AnswerValue } from "./types";

function validateOption(option: any): Option {
  if (typeof option !== "object" || !option.text || option.value === undefined) {
    throw new Error("Invalid option format");
  }
  return {
    text: String(option.text),
    value: option.value,
  };
}

function validateDisplayCondition(condition: any): DisplayCondition {
  if (!condition.question_id || !condition.operator || condition.value === undefined) {
    throw new Error("Invalid display condition format");
  }
  return {
    question_id: String(condition.question_id),
    operator: condition.operator as "==" | "!=" | ">",
    value: condition.value,
  };
}

function validateQuestion(question: any): Question {
  if (!question.id || !question.text || !question.type || question.required === undefined) {
    throw new Error("Invalid question format");
  }

  const baseQuestion = {
    id: String(question.id),
    text: String(question.text),
    required: Boolean(question.required),
    display_condition: question.display_condition 
      ? validateDisplayCondition(question.display_condition)
      : undefined,
  };

  switch (question.type) {
    case "single_choice":
      if (!Array.isArray(question.options)) {
        throw new Error("Single choice question must have options array");
      }
      return {
        ...baseQuestion,
        type: "single_choice" as const,
        options: question.options.map(validateOption),
      };

    case "multiple_choice":
      if (!Array.isArray(question.options)) {
        throw new Error("Multiple choice question must have options array");
      }
      return {
        ...baseQuestion,
        type: "multiple_choice" as const,
        options: question.options.map(validateOption),
      };

    case "grid":
      if (!Array.isArray(question.rows) || !Array.isArray(question.columns)) {
        throw new Error("Grid question must have rows and columns arrays");
      }
      return {
        ...baseQuestion,
        type: "grid" as const,
        rows: question.rows.map((row: any) => ({
          text: String(row.text),
          value: String(row.value),
        })),
        columns: question.columns.map((col: any) => ({
          text: String(col.text),
          value: String(col.value),
        })),
      };

    case "number_input":
      return {
        ...baseQuestion,
        type: "number_input" as const,
      };

    case "text_input":
      return {
        ...baseQuestion,
        type: "text_input" as const,
      };

    default:
      throw new Error(`Unsupported question type: ${question.type}`);
  }
}

function validateSection(section: any): Section {
  if (!section.id || !section.title || !Array.isArray(section.questions)) {
    throw new Error("Invalid section format");
  }

  return {
    id: String(section.id),
    title: String(section.title),
    questions: section.questions.map(validateQuestion),
  };
}

export function validateSurveyData(data: any): Survey {
  if (!data.survey_name || !Array.isArray(data.sections)) {
    throw new Error("Invalid survey format");
  }

  return {
    survey_name: String(data.survey_name),
    sections: data.sections.map(validateSection),
  };
}

function isValidAnswerValue(value: unknown): value is AnswerValue {
    if (value === null || value === undefined) return false;
  
    // Check for primitive types
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return true;
    }
  
    // Check for number array
    if (Array.isArray(value) && value.every(item => typeof item === 'number')) {
      return true;
    }
  
    // Check for Record<number, string>
    if (
      typeof value === 'object' &&
      value !== null &&
      Object.entries(value).every(
        ([key, val]) =>
          !isNaN(Number(key)) && typeof val === 'string'
      )
    ) {
      return true;
    }
  
    return false;
  }
  
  function isValidAnswer(answer: unknown): answer is Answer {
    if (!answer || typeof answer !== 'object') return false;
  
    const { sectionId, questionId, value } = answer as any;
  
    return (
      typeof sectionId === 'string' &&
      typeof questionId === 'string' &&
      isValidAnswerValue(value)
    );
  }
  
  export function validateAnswers(answers: unknown): Answer[] {
    if (!Array.isArray(answers)) {
      return [];
    }
  
    const validAnswers = answers.filter(isValidAnswer);
    return validAnswers;
  }