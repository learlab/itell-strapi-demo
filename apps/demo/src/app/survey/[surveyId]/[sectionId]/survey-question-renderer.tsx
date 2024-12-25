import React from "react";
import { buttonVariants } from "@itell/ui/button";
import { Checkbox } from "@itell/ui/checkbox";
import { Input } from "@itell/ui/input";
import { Label } from "@itell/ui/label";
import MultipleSelector from "@itell/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { ScrollArea } from "@itell/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@itell/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@itell/ui/toggle-group";
import { cn } from "@itell/utils";
import { type Survey } from "#content";
import { z } from "zod";

const SingleChoiceDataSchema = z.string();
const SingleSelectDataSchema = z.string();
const NumberInputDataSchema = z.union([z.string(), z.number()]);
const TextInputDataSchema = z.string();
const MultipleChoiceDataSchema = z.array(z.string());
const MultipleSelectDataSchema = z.array(
  z.object({
    label: z.string(),
    value: z.string(),
  })
);
const GridDataSchema = z.record(z.string());
const ToggleGroupDataSchema = z.array(z.string());

export const SurveyQuestionDataSchema = z.union([
  SingleChoiceDataSchema,
  SingleChoiceDataSchema,
  NumberInputDataSchema,
  MultipleChoiceDataSchema,
  MultipleSelectDataSchema,
  GridDataSchema,
  ToggleGroupDataSchema,
]);
export type SurveyQuestionData = z.infer<typeof SurveyQuestionDataSchema>;
type SurveyQuestion = Survey["sections"][0]["questions"][0];

export function SurveyQuestionRenderer({
  question,
  sessionData,
}: {
  question: SurveyQuestion;
  sessionData?: SurveyQuestionData | null;
}) {
  if (question.type === "single_choice") {
    const result = SingleChoiceDataSchema.safeParse(sessionData);
    const defaultValue = result.success ? result.data : undefined;
    return (
      <SingleChoiceQuestion question={question} defaultValue={defaultValue} />
    );
  }

  if (question.type === "single_select") {
    const result = SingleSelectDataSchema.safeParse(sessionData);
    const defaultValue = result.success ? result.data : undefined;
    return (
      <SingleSelectQuestion question={question} defaultValue={defaultValue} />
    );
  }

  if (question.type === "multiple_choice") {
    const result = MultipleChoiceDataSchema.safeParse(sessionData);
    const defaultValue = result.success ? result.data : undefined;
    return (
      <MultipleChoiceQuestion question={question} defaultValue={defaultValue} />
    );
  }

  if (question.type === "multiple_select") {
    const result = MultipleSelectDataSchema.safeParse(sessionData);
    const defaultValue = result.success ? result.data : undefined;
    return (
      <MultiSelectQuestion question={question} defaultValue={defaultValue} />
    );
  }

  if (question.type === "number_input") {
    const result = NumberInputDataSchema.safeParse(sessionData);
    const defaultValue = result.success ? result.data : undefined;
    return (
      <NumberInputQuestion
        question={question}
        defaultValue={Number(defaultValue)}
      />
    );
  }

  if (question.type === "text_input") {
    const result = TextInputDataSchema.safeParse(sessionData);
    const defaultValue = result.success ? result.data : undefined;
    return <TextInput question={question} defaultValue={defaultValue} />;
  }

  if (question.type === "grid") {
    const result = GridDataSchema.safeParse(sessionData);
    const defaultValue = result.success ? result.data : undefined;
    return <GridQuestion question={question} defaultValue={defaultValue} />;
  }

  if (question.type === "toggle_group") {
    const result = ToggleGroupDataSchema.safeParse(sessionData);
    const defaultValue = result.success ? result.data : undefined;
    return (
      <ToggleGroupQuestion question={question} defaultValue={defaultValue} />
    );
  }
}

function SingleChoiceQuestion({
  question,
  defaultValue,
}: {
  question: Extract<SurveyQuestion, { type: "single_choice" }>;
  defaultValue?: string;
}) {
  return (
    <RadioGroup
      name={question.id}
      required={question.required}
      className="flex flex-col gap-1.5"
      defaultValue={defaultValue}
    >
      {question.options.map((option) => (
        <Label
          className={cn(
            buttonVariants({ size: "lg", variant: "ghost" }),
            "h-fit justify-start text-wrap py-3 pl-2 has-[:checked]:bg-primary/85 has-[:checked]:text-primary-foreground xl:text-base"
          )}
          key={String(option.value)}
        >
          <RadioGroupItem value={String(option.text)} className="sr-only" />
          <span>{option.text}</span>
        </Label>
      ))}
    </RadioGroup>
  );
}

function SingleSelectQuestion({
  question,
  defaultValue,
}: {
  question: Extract<SurveyQuestion, { type: "single_select" }>;
  defaultValue?: string;
}) {
  return (
    <Select
      name={question.id}
      required={question.required}
      defaultValue={defaultValue}
    >
      <SelectTrigger className="w-96">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[60vh]">
          {question.options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.text)}>
              {option.text}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}

function MultipleChoiceQuestion({
  question,
  defaultValue,
}: {
  question: Extract<SurveyQuestion, { type: "multiple_choice" }>;
  defaultValue?: string[];
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3">
      {question.options.map((option) => (
        <Label
          key={String(option.value)}
          className="flex items-center gap-2 xl:text-lg"
        >
          <Checkbox
            name={`${question.id}--${option.value}`}
            value={String(option.text)}
            defaultChecked={defaultValue?.includes(option.text)}
          />
          <span>{option.text}</span>
        </Label>
      ))}
    </div>
  );
}

function MultiSelectQuestion({
  question,
  defaultValue,
}: {
  question: Extract<SurveyQuestion, { type: "multiple_select" }>;
  defaultValue?: React.ComponentPropsWithoutRef<
    typeof MultipleSelector
  >["defaultOptions"];
}) {
  return (
    <MultipleSelector
      defaultOptions={question.options.map((option) => ({
        value: String(option.value),
        label: option.text,
      }))}
      placeholder="Select all that apply"
      badgeClassName="bg-secondary text-secondary-foreground lg:text-base  hover:bg-primary/80 hover:text-primary-foreground"
      formInputName={question.id}
      value={defaultValue}
    />
  );
}

function NumberInputQuestion({
  question,
  defaultValue,
}: {
  question: Extract<SurveyQuestion, { type: "number_input" }>;
  defaultValue?: number;
}) {
  return (
    <Label>
      <span className="sr-only">{question.text}</span>
      <Input
        type="number"
        name={question.id}
        required={question.required}
        className="w-80"
        min={1}
        placeholder="Enter your answer"
        defaultValue={defaultValue}
      />
    </Label>
  );
}

function TextInput({
  question,
  defaultValue,
}: {
  question: Extract<SurveyQuestion, { type: "text_input" }>;
  defaultValue?: string;
}) {
  return (
    <Label>
      <span className="sr-only">{question.text}</span>
      <Input
        type="text"
        required={question.required}
        className="w-80"
        placeholder={"Enter your answer"}
        name={question.id}
        defaultValue={defaultValue}
      />
    </Label>
  );
}

function GridQuestion({
  question,
  defaultValue,
}: {
  question: Extract<SurveyQuestion, { type: "grid" }>;
  defaultValue?: Record<string, string>;
}) {
  return (
    <Table className="caption-top">
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          {question.columns.map((col) => (
            <TableHead key={String(col.value)}>
              <span className="font-semibold">{col.text}</span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {question.rows.map((row) => (
          <TableRow key={String(row.value)}>
            <TableCell className="w-80 text-left lg:text-base xl:text-lg">
              <legend>{row.text}</legend>
            </TableCell>
            {question.columns.map((col) => (
              <TableCell key={String(col.value)}>
                <label className="block h-full w-full cursor-pointer">
                  <span className="sr-only">{col.text}</span>
                  <input
                    type="radio"
                    name={`${question.id}--${String(row.text)}`}
                    value={String(col.text)}
                    defaultChecked={
                      String(col.text) === defaultValue?.[row.text]
                    }
                    className="peer sr-only"
                    required={true}
                  />
                  <span className="relative inline-block h-6 w-6 rounded-full border-2 border-gray-300 transition-colors duration-200 ease-in-out peer-checked:border-info peer-focus:ring-2 peer-focus:ring-info peer-focus:ring-offset-2">
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-3 w-3 rounded-full bg-info opacity-0 transition-opacity duration-200 ease-in-out peer-checked:opacity-100"></span>
                    </span>
                  </span>
                </label>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ToggleGroupQuestion({
  question,
  defaultValue,
}: {
  question: Extract<SurveyQuestion, { type: "toggle_group" }>;
  defaultValue?: string[];
}) {
  console.log(defaultValue);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {question.options.map((option) => (
        <RadioGroup
          name={`${question.id}--${option}`}
          key={option}
          className="flex flex-col gap-1.5"
          defaultValue={defaultValue?.includes(option) ? option : undefined}
        >
          <Label
            className={cn(
              buttonVariants({ size: "lg", variant: "ghost" }),
              "h-fit justify-start text-wrap py-3 pl-2 has-[:checked]:bg-primary/85 has-[:checked]:text-primary-foreground xl:text-base"
            )}
            key={option}
          >
            <RadioGroupItem value={option} className="sr-only" />
            <span>{option}</span>
          </Label>
        </RadioGroup>
      ))}
    </div>
  );
}
