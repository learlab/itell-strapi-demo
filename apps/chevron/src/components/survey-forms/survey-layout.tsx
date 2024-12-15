import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@itell/ui/button";
import { QuestionRenderer } from "./questions";
import type { Question, Section, Answer } from "./types";

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
  renderQuestion?: () => React.ReactNode;
}

const FloatingProgressBar = ({ progress, buttonBgColor }: { progress: number; buttonBgColor: string }) => (
  <div className="fixed top-0 left-0 right-0 z-50">
    <div className="max-w-3xl mx-auto px-6">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${buttonBgColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>
);

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
    const content = instructionId === "start" ? instruction.start : instruction.end;
    return (
      <div className="space-y-4">
        <p className="text-lg text-gray-600">{content}</p>
      </div>
    );
  };

  const renderQuestionContent = () => {
    if (renderQuestion) {
      return renderQuestion();
    }

    return question ? (
      <QuestionRenderer
        question={question}
        currentAnswer={currentAnswer}
        onAnswer={onAnswer}
      />
    ) : null;
  };

  return (
    <>
      {!showingInstruction && (
        <FloatingProgressBar progress={progress} buttonBgColor={buttonBgColor} />
      )}
      
      <div className="max-w-3xl mx-auto p-6 space-y-8 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
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
            {showingInstruction ? renderInstructionScreen(showingInstruction) : renderQuestionContent()}
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
    </>
  );
};

export default SurveyLayout;