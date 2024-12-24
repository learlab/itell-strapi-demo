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

type SurveyQuestion = Survey["sections"][0]["questions"][0];
type SingleChoiceQuestion = Extract<SurveyQuestion, { type: "single_choice" }>;

export function SurveyQuestionRenderer({
  question,
}: {
  question: SurveyQuestion;
}) {
  if (question.type === "single_choice") {
    return <SingleChoiceQuestion question={question} />;
  }

  if (question.type === "single_select") {
    return <SingleSelectQuestion question={question} />;
  }

  if (question.type === "multiple_choice") {
    return <MultipleChoiceQuestion question={question} />;
  }

  if (question.type === "multiple_select") {
    return <MultiSelectQuestion question={question} />;
  }

  if (question.type === "number_input") {
    return <NumberInputQuestion question={question} />;
  }

  if (question.type === "text_input") {
    return <TextInput question={question} />;
  }

  if (question.type === "grid") {
    return <GridQuestion question={question} />;
  }

  if (question.type === "toggle_group") {
    return <ToggleGroupQuestion question={question} />;
  }
}

function SingleChoiceQuestion({
  question,
}: {
  question: SingleChoiceQuestion;
}) {
  return (
    <RadioGroup
      name={question.id}
      required={question.required}
      className="flex flex-col gap-1.5"
    >
      {question.options.map((option) => (
        <Label
          className={cn(
            buttonVariants({ size: "lg", variant: "ghost" }),
            "h-fit justify-start text-wrap py-3 pl-2 has-[:checked]:bg-primary/85 has-[:checked]:text-primary-foreground xl:text-base"
          )}
          key={option.text}
        >
          <RadioGroupItem value={String(option.value)} className="sr-only" />
          <span>{option.text}</span>
        </Label>
      ))}
    </RadioGroup>
  );
}

function SingleSelectQuestion({
  question,
}: {
  question: Extract<SurveyQuestion, { type: "single_select" }>;
}) {
  return (
    <Select name={question.id} required={question.required}>
      <SelectTrigger className="w-96">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[60vh]">
          {question.options.map((option) => (
            <SelectItem key={String(option.text)} value={String(option.value)}>
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
}: {
  question: Extract<SurveyQuestion, { type: "multiple_choice" }>;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3">
      {question.options.map((option, idx) => (
        <Label
          key={String(option.value)}
          className="flex items-center gap-2 xl:text-lg"
        >
          <Checkbox
            name={`${question.id}--${idx}`}
            value={String(option.value)}
          />
          <span>{option.text}</span>
        </Label>
      ))}
    </div>
  );
}

function MultiSelectQuestion({
  question,
}: {
  question: Extract<SurveyQuestion, { type: "multiple_select" }>;
}) {
  return (
    <MultipleSelector
      options={question.options.map((option) => ({
        value: String(option.value),
        label: option.text,
      }))}
      placeholder="Select all that apply"
      badgeClassName="bg-secondary text-secondary-foreground lg:text-base  hover:bg-primary/80 hover:text-primary-foreground"
      formInputName={question.id}
    />
  );
}

function NumberInputQuestion({
  question,
}: {
  question: Extract<SurveyQuestion, { type: "number_input" }>;
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
        placeholder={"20"}
      />
    </Label>
  );
}

function TextInput({
  question,
}: {
  question: Extract<SurveyQuestion, { type: "text_input" }>;
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
      />
    </Label>
  );
}

function GridQuestion({
  question,
}: {
  question: Extract<SurveyQuestion, { type: "grid" }>;
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
                    name={`${question.id}--${String(row.value)}`}
                    value={String(col.value)}
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
}: {
  question: Extract<SurveyQuestion, { type: "toggle_group" }>;
}) {
  return (
    <ToggleGroup
      type="multiple"
      className="grid grid-cols-1 gap-4 lg:grid-cols-3"
    >
      {question.options.map((option) => (
        <ToggleGroupItem key={option} value={option} className="lg:text-base">
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
