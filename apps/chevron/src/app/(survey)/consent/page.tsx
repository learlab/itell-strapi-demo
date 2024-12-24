'use client'
import ConsentForm from "@/components/survey-forms/consent-form";
import { getSession } from "@/lib/auth";
import { useState } from "react";
export default async function Page()


const ConsentPage: React.FC = () => {
  
  // const [consentGiven, setConsentGiven] = useState(false);

  // const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setConsentGiven(event.target.checked);
  // };

  // const handleSubmit = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (consentGiven) {
  //     toast.success("Consent given. Thank you!");
  //     redirect("/intake")
  //   } else {
  //     toast.warning("Consent not given. You will be redirected to the text anyway.");
  //   }
  // };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Consent Form</h1>
      <ConsentForm />
    </div>
  );
};

export default ConsentPage;