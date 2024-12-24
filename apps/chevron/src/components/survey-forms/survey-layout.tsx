import { Button, buttonVariants } from "@itell/ui/button";
import { ArrowRight } from "lucide-react";
import { QuestionRenderer } from "./questions";
import type { Answer, Question, Section } from "./types";

interface SurveyLayoutProps {
  section?: Section;
  question?: Question;
  showingInstruction: string | null;
  progress: number;
  currentAnswer?: Answer["value"];
  instruction?: {
    start: string;
    end: string;
  };
  onAnswer: (value: Answer["value"]) => void;
  onNavigation: (direction: "next" | "back") => void;
  isFirstQuestion: boolean;
  isQuestionAnswered: boolean;
  // New prop for custom question rendering
  renderQuestion?: () => React.ReactNode;
}

export const SurveyLayout = ({
  section,
  question,
  showingInstruction,
  progress,
  currentAnswer,
  instruction = {
    start: "Welcome to the survey",
    end: "Thank you for completing the survey",
  },
  onAnswer,
  onNavigation,
  isFirstQuestion,
  isQuestionAnswered,
  renderQuestion,
}: SurveyLayoutProps) => {
  const buttonStyle = buttonVariants({ variant: "default" });
  const bgColorMatch = buttonStyle.match(/bg-([^\s]+)/);
  const buttonBgColor = bgColorMatch ? bgColorMatch[0] : "bg-primary";

  const renderInstructionScreen = (instructionId: string) => {
    const content =
      instructionId === "start" ? instruction.start : instruction.end;
    return (
      <div className="space-y-4">
        <p className="text-lg text-gray-600">{content}</p>
      </div>
    );
  };

  const renderQuestionContent = () => {
    if (renderQuestion) {
      <div className="w-full max-w-2xl mx-auto">
      return renderQuestion();
      </div>
    }

    return question ? (
      <div className="w-full max-w-2xl mx-auto">
      <QuestionRenderer
        question={question}
        currentAnswer={currentAnswer}
        onAnswer={onAnswer}
      />
      </div>
    ) : null;
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <div className="relative rounded-lg bg-white shadow-lg">
        {!showingInstruction && (
          <div className="sticky top-0 rounded-t-lg bg-white p-6 pb-0">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all ${buttonBgColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="space-y-2">
            {!showingInstruction && (
              <>
                <h2 className="text-2xl font-bold text-gray-900">
                  {section?.title}
                </h2>
                <p className="text-gray-600">{question?.text}</p>
              </>
            )}
          </div>

          <div className="min-h-[200px]">
            {showingInstruction
              ? renderInstructionScreen(showingInstruction)
              : renderQuestionContent()}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={() => onNavigation("back")}
              disabled={isFirstQuestion && showingInstruction === "start"}
            >
              Back
            </Button>

            <Button
              onClick={() => onNavigation("next")}
              disabled={!isQuestionAnswered}
            >
              {showingInstruction === "end" ? "Submit" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};