import type { 
    Question,
    SingleChoiceQuestion,
    MultipleChoiceQuestion,
    GridQuestion,
    NumberInputQuestion,
    TextInputQuestion
  } from './types';
  
  export function isGridQuestion(question: Question): question is GridQuestion {
    return question.type === 'grid';
  }
  
  export function isSingleChoiceQuestion(question: Question): question is SingleChoiceQuestion {
    return question.type === 'single_choice' || question.type === 'true_false';
  }
  
  export function isMultipleChoiceQuestion(question: Question): question is MultipleChoiceQuestion {
    return question.type === 'multiple_choice';
  }
  
  export function isTextInputQuestion(question: Question): question is TextInputQuestion {
    return question.type === 'text_input';
  }
  
  export function isNumberInputQuestion(question: Question): question is NumberInputQuestion {
    return question.type === 'number_input';
  }