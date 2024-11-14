
import React from "react";
import SurveyForm from "@/components/survey-forms/intake-survey-form1";

const SurveyPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Demographics Survey</h1>
      <SurveyForm />
    </div>
  );
};

export default SurveyPage;