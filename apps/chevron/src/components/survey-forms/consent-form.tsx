'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { Button } from "@itell/ui/button";
import { Input } from "@itell/ui/input";
import { useServerAction } from "zsa-react";
import { updateUserAction } from "@/actions/user";
import { useEffect } from "react";

const ConsentForm: React.FC = () => {
    const [consent, setConsent] = useState(true);
    const router = useRouter();
    const { isPending, execute, isError, error } =
      useServerAction(updateUserAction);
    const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setConsent(event.target.value==='true');
    };
    
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      const [_, err] = await execute({ consent: consent });
      if (consent) {
        toast.success("Consent given. Thank you!");
        router.push("/intake");
      } else {
        toast.warning("Consent not given. You will be redirected to the text anyway.");
        router.push("/")
      }
    };

    useEffect(() => {
      if (isError) {
        toast.error("Error with consent.");
        reportSentry("consent", { error });
      }
    }, [isError]);
    
  
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <div className="max-w-2xl rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Vanderbilt University</h1>
          <p className="mb-4 text-gray-700">Title: Intelligent Textbook Assessment</p>
          <p className="mb-4 text-gray-700">Principal Investigator: Scott Crossley</p>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Purpose of the Study</h2>
          <p className="mb-4 text-gray-700">
            The purpose of this study is to collect data from trainees using an intelligent training text which
            focuses on read-to-write tasks. Read-to-write tasks like summaries and short answer-questions are a common approach for assessing learning.
            Activities within an intelligent text should support interactive learning for a variety of complex subjects
            and provide students with opportunities to better comprehend the material. We hope to assess this in the current data collection
          </p>
  
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Procedures</h2>
          <p className="mb-4 text-gray-700">You are being asked to take part in a research study. If you decide to take part, you will:</p>
          <ol className="mb-4 list-disc space-y-2 pl-5 text-gray-700">
            <li>Complete a demographic and individual differences survey</li>
            <li>Complete a short language proficiency assessment</li>
            <li>Complete a pretest quiz that includes 14 true/false questions</li>
            <li>Complete an assessment of your previous understanding of the topic</li>
            <li>Read the text <i>Confined Space Entry Standard</i></li>
            <li>Complete a post-test quiz that includes 14 true/false questions</li>
            <li>Take a survey on engagement, motivation, and user experience that focuses on user experiences with intelligent texts</li>
          </ol>
          <p>This study will take about an hour to complete</p>
  
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Compensation</h2>
          <p className="mb-4 text-gray-700">
            You will recieve no financial compensation for this task
          </p>
  
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Risks</h2>
          <p className="mb-4 text-gray-700">
            This study involves no more than minimal risk and involves no more risk than experienced in a normal day.
          </p>
  
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Benefits</h2>
          <p className="mb-4 text-gray-700">
            You will gain experience in the research process. 
            Your interaction with the intelligent textbook may lead to greater learning relative to a static electronic textbook.
            Your participation will help researchers and educators better understand successful summarization.
          </p>
  
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Voluntary Participation and Withdrawal</h2>
          <p className="mb-4 text-gray-700">
            You do not have to be in this study.
            You may skip questions or stop participating at any time.
          </p>
  
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Contact Information</h2>
          <p className="mb-4 text-gray-700">
            Contact Dr. Scott Crossley at <a href='scott.crossley@vanderbilt.edu'>scott.crossley@vanderbilt.edu</a>
          </p>  
          <ul>
              <li>If you have any questions about the study or your part in it</li>
              <li>If you have questions or concerns about the study</li>
          </ul>
          <p className="mb-4 text-gray-700">
              For additional information about your rights as a participant in the study,
              to discuss problems, concerns, and questions,
              please feel free to contact the Institutional Review Board Office at (615) 322-2918 
              or toll free at (866) 224-8273.
          </p>
  
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Agreement</h2>
          <p className="mb-4 text-gray-700">
            If you are over 18 years old and agree to have your data used for this study, 
            please indicate your agreement by clicking "I am over 18 years of age and I agree to having my data used in this study"
          </p>        
  
          <form onSubmit={handleSubmit} className="mt-6"> 
            <div className="flex flex-col p-2 pl-12 gap-3">
              <Input 
                type="radio" 
                id="consentYes"
                name="consentButtons" 
                value="true"
                onChange={handleConsentChange}/>
              <label htmlFor="html">I have read and understood the information above, I am 18 years or older, and I agree to participate in this study.</label>
              <Input 
                type="radio" 
                id="consentNo"
                name="consentButtons" 
                value="false"
                onChange={handleConsentChange}/>
              <label htmlFor="css" className="flex center">I am under 18 and/or I do not agree to participate in the study.</label> 
            </div>
  
            <Button
              type="submit"
              className="mt-6 w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={ isPending }
            >
              Submit Consent Form
            </Button>
          </form>
        </div>
      </div>
    );
  };
  
  export default ConsentForm;
  