import { redirect } from "next/navigation";
import { volume } from "#content";

import "./styles.css";

import { updateUserAction } from "@/actions/user";
import { ContinueReading } from "@/components/continue-reading";
import { getSession } from "@/lib/auth";
import { ConsentForm } from "./form";

export default async function ConsentPage() {
  const session = await getSession();
  if (!session.user) {
    redirect("/auth");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6">
      {session.user.consentGiven !== null ? (
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight">
            You gave consent previously.
          </h2>
          <ContinueReading />
        </div>
      ) : (
        <ConsentText />
      )}
    </div>
  );
}

function ConsentText() {
  return (
    <div
      id="consent-form"
      className="flex min-h-screen flex-col items-center justify-center bg-muted/70 p-6 text-foreground xl:text-lg"
    >
      <div className="flex max-w-3xl flex-col gap-6 rounded-lg border-4 px-6 py-4 shadow-md">
        <div className="space-y-2">
          <h1 className="text-center text-3xl font-bold">
            <p>Vanderbilt University</p>
          </h1>
          <h1 className="text-center text-3xl font-medium">Consent Form</h1>
          <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <p>
              <span className="font-bold">Title:</span> Intelligent Textbook
              Assessment
            </p>
            <p>
              <span className="font-bold">Principal Investigator:</span> Scott
              Crossley
            </p>
          </div>
        </div>

        <FormSection id="study-purpose" title="Purpose of the Study">
          <p>
            The purpose of this study is to collect data from trainees using an
            intelligent training text which focuses on read-to-write tasks.
            Read-to-write tasks like summaries and short answer-questions are a
            common approach for assessing learning. Activities within an
            intelligent text should support interactive learning for a variety
            of complex subjects and provide students with opportunities to
            better comprehend the material. We hope to assess this in the
            current data collection.
          </p>
        </FormSection>

        <FormSection id="procedures" title="Procedures">
          <p>
            You are being asked to take part in a research study. If you decide
            to take part, you will:
          </p>
          <ol className="list-disc space-y-3 pl-6">
            <li>Complete a demographic and individual differences survey</li>
            <li>Complete a short language proficiency assessment</li>
            <li>
              Complete a pretest quiz that includes 14 true/false questions
            </li>
            <li>
              Complete an assessment of your previous understanding of the topic
            </li>
            <li>
              Read the text <span className="italic">{volume.title}</span>
            </li>
            <li>
              Complete a post-test quiz that includes 14 true/false questions
            </li>
            <li>
              Take a survey on engagement, motivation, and user experience that
              focuses on user experiences with intelligent texts
            </li>
          </ol>
          <p>This study will take about an hour to complete.</p>
        </FormSection>

        <FormSection id="compensation" title="Compensation">
          <p>You will receive no financial compensation for this task</p>
        </FormSection>

        <FormSection id="risks" title="Risks">
          <p>
            This study involves no more than minimal risk and involves no more
            risk than experienced in a normal day.
          </p>
        </FormSection>

        <FormSection id="benefits" title="Benefits">
          <p>
            You will gain experience in the research process. Your interaction
            with the intelligent textbook may lead to greater learning relative
            to a static electronic textbook. Your participation will help
            researchers and educators better understand successful
            summarization.
          </p>
        </FormSection>

        <FormSection
          id="voluntary-participation"
          title="Voluntary Participation and Withdrawal"
        >
          <p>
            You do not have to be in this study. You may skip questions or stop
            participating at any time.
          </p>
        </FormSection>

        <FormSection id="contact" title="Contact">
          <p>
            Contact Dr. Scott Crossley at{" "}
            <a
              href="mailto:scott.crossley@vanderbilt.edu"
              className="font-medium"
            >
              scott.crossley@vanderbilt.edu
            </a>{" "}
            if
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              If you have any questions about the study or your part in it
            </li>
            <li>If you have questions or concerns about the study</li>
          </ul>
          <p>
            For additional information about your rights as a participant in the
            study, to discuss problems, concerns, and questions, please feel
            free to contact the Institutional Review Board Office at (615)
            322-2918 or toll free at (866) 224-8273.
          </p>
        </FormSection>

        <FormSection id="agreement" title="Agreement">
          <ConsentForm
            action={async (val) => {
              "use server";
              await updateUserAction({ consentGiven: val });
              redirect("/");
            }}
          />
        </FormSection>
      </div>
    </div>
  );
}

function FormSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2" aria-labelledby={id}>
      <h2 id={id} className={"text-xl font-semibold tracking-tight"}>
        {title}
      </h2>
      {children}
    </section>
  );
}
