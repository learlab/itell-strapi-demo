import { s } from "velite";

// Basic option schema for single/multiple choice questions
const OptionSchema = s.object({
  text: s.string(),
  value: s.union([s.string(), s.number(), s.boolean()]),
});

// Display condition schema
const DisplayConditionSchema = s
  .object({
    question_id: s.string(),
    operator: s.string(),
    value: s.union([s.string(), s.number()]),
  })
  .optional();

// Base question schema with common properties
const BaseQuestionSchema = s.object({
  id: s.string(),
  text: s.string(),
  required: s.boolean(),
  display_condition: DisplayConditionSchema,
});

// Specific question type schemas
const SingleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: s.literal("single_choice"),
  options: s.array(OptionSchema),
});

const SingleSelectQuestionSchema = BaseQuestionSchema.extend({
  type: s.literal("single_select"),
  options: s.array(OptionSchema),
});

const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: s.literal("multiple_choice"),
  options: s.array(OptionSchema),
});

export const MultipleSelectQuestionSchema = BaseQuestionSchema.extend({
  type: s.literal("multiple_select"),
  options: s.array(OptionSchema),
});

const TextInputQuestionSchema = BaseQuestionSchema.extend({
  type: s.literal("text_input"),
});

const NumberInputQuestionSchema = BaseQuestionSchema.extend({
  type: s.literal("number_input"),
});

const ToggleGroupQuestionSchema = BaseQuestionSchema.extend({
  type: s.literal("toggle_group"),
  options: s.array(s.string()),
});

const GridQuestionSchema = BaseQuestionSchema.extend({
  type: s.literal("grid"),
  rows: s.array(OptionSchema),
  columns: s.array(OptionSchema),
});

// Combined question schema using discriminated union
const QuestionSchema = s.discriminatedUnion("type", [
  SingleChoiceQuestionSchema,
  SingleSelectQuestionSchema,
  MultipleChoiceQuestionSchema,
  MultipleSelectQuestionSchema,
  TextInputQuestionSchema,
  NumberInputQuestionSchema,
  GridQuestionSchema,
  ToggleGroupQuestionSchema,
]);

// Section schema
const SectionSchema = s.object({
  id: s.string(),
  title: s.string(),
  questions: s.array(QuestionSchema),
});

// Main survey schema
export const SurveySchema = s.object({
  survey_id: s.string(),
  survey_name: s.string(),
  survey_description: s.string(),
  sections: s.array(SectionSchema),
});
