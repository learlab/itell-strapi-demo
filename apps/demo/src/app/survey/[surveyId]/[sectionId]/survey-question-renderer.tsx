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
import { cn } from "@itell/utils";
import { type Survey } from "#content";
import { z } from "zod";

type BaseQuestionProps<TQuestion> = {
  question: TQuestion;
  defaultValue?: any;
};

// Schema definitions
const questionDataMap = {
  single_choice: z.string(),
  single_select: z.string(),
  number_input: z.union([z.string(), z.number()]),
  text_input: z.string(),
  multiple_choice: z.array(z.string()),
  multiple_select: z.array(z.object({ label: z.string(), value: z.string() })),
  grid: z.record(z.string()),
  toggle_group: z.array(z.string()),
} as const;

//  Object.values(questionDataMap) yields type error
export const SurveyQuestionDataSchema = z.union([
  questionDataMap.single_choice,
  questionDataMap.single_select,
  questionDataMap.number_input,
  questionDataMap.text_input,
  questionDataMap.multiple_choice,
  questionDataMap.multiple_select,
  questionDataMap.grid,
  questionDataMap.toggle_group,
]);
export type SurveyQuestionData = z.infer<typeof SurveyQuestionDataSchema>;
type SurveyQuestion = Survey["sections"][0]["questions"][0];

const StyledLabel = ({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <Label
    className={cn(
      buttonVariants({ size: "lg", variant: "ghost" }),
      "h-fit justify-start text-wrap py-3 pl-2 has-[:checked]:bg-primary/85 has-[:checked]:text-primary-foreground xl:text-base",
      className
    )}
    {...props}
  >
    {children}
  </Label>
);

const parseSessionData = <T extends z.ZodType>(schema: T, data: any) => {
  const result = schema.safeParse(data);
  return result.success ? result.data : undefined;
};

// Question Components
function SingleChoiceQuestion({
  question,
  defaultValue,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "single_choice" }>>) {
  return (
    <RadioGroup
      name={question.id}
      required={question.required}
      className="flex flex-col gap-1.5"
      defaultValue={defaultValue}
    >
      {question.options.map((option) => (
        <StyledLabel key={String(option.value)}>
          <RadioGroupItem value={String(option.text)} className="sr-only" />
          <span>{option.text}</span>
        </StyledLabel>
      ))}
    </RadioGroup>
  );
}

function SingleSelectQuestion({
  question,
  defaultValue,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "single_select" }>>) {
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

function InputQuestion<
  T extends Extract<SurveyQuestion, { type: "number_input" | "text_input" }>,
>({
  question,
  defaultValue,
  type,
}: BaseQuestionProps<T> & { type: "number" | "text" }) {
  return (
    <Label>
      <span className="sr-only">{question.text}</span>
      <Input
        type={type}
        name={question.id}
        required={question.required}
        className="w-80"
        min={type === "number" ? 1 : undefined}
        placeholder="Enter your answer"
        defaultValue={defaultValue}
      />
    </Label>
  );
}

function MultipleChoiceQuestion({
  question,
  defaultValue,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "multiple_choice" }>>) {
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
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "multiple_select" }>>) {
  return (
    <MultipleSelector
      defaultOptions={question.options.map((option) => ({
        value: String(option.value),
        label: option.text,
      }))}
      placeholder="Select all that apply"
      badgeClassName="bg-secondary text-secondary-foreground lg:text-base hover:bg-primary/80 hover:text-primary-foreground"
      formInputName={question.id}
      value={defaultValue}
    />
  );
}

function GridQuestion({
  question,
  defaultValue,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "grid" }>>) {
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
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "toggle_group" }>>) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {question.options.map((option) => (
        <RadioGroup
          name={`${question.id}--${option}`}
          key={option}
          className="flex flex-col gap-1.5"
          defaultValue={defaultValue?.includes(option) ? option : undefined}
        >
          <StyledLabel key={option}>
            <RadioGroupItem value={option} className="sr-only" />
            <span>{option}</span>
          </StyledLabel>
        </RadioGroup>
      ))}
    </div>
  );
}

const componentMap = {
  single_choice: SingleChoiceQuestion,
  single_select: SingleSelectQuestion,
  multiple_choice: MultipleChoiceQuestion,
  multiple_select: MultiSelectQuestion,
  number_input: (props: any) => <InputQuestion {...props} type="number" />,
  text_input: (props: any) => <InputQuestion {...props} type="text" />,
  grid: GridQuestion,
  toggle_group: ToggleGroupQuestion,
} as const;

export function SurveyQuestionRenderer({
  question,
  sessionData,
}: {
  question: SurveyQuestion;
  sessionData?: SurveyQuestionData | null;
}) {
  const Component = componentMap[question.type];
  const schema = questionDataMap[question.type];
  const defaultValue = parseSessionData(schema, sessionData);

  if (!Component) {
    console.warn(`Unsupported question type: ${question.type}`);
    return null;
  }

  return <Component question={question} defaultValue={defaultValue} />;
}
