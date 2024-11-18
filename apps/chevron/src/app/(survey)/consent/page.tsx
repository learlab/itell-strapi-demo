'use server'
import ConsentForm from "@/components/survey-forms/consent-form";
import { getSession } from "@/lib/auth";
export default async function Page()
    // const { user } = getSession();
    // console.log(user);


const ConsentPage: React.FC = () => {
  const { user } = await getSession();
  console.log(`User name is ${user}`)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Consent Form</h1>
      <ConsentForm />
    </div>
  );
};

export default ConsentPage;