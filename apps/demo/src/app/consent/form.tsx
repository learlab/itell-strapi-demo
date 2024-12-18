"use client";

import Form from "next/form";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export function ConsentForm({ action }: { action: (val: boolean) => void }) {
  return (
    <Form
      action={(formData) => {
        const given = formData.get("agreement") === "yes";
        if (given) {
          toast.success("Consent given. Thank you!");
        } else {
          toast.warning(
            "Consent not given. You will be redirected to the text anyway."
          );
        }
        action(given);
      }}
      className="flex flex-col gap-4"
    >
      <p>
        If you are over 18 years old and agree to have your data used for this
        study, please indicate your agreement by clicking &quot;I am over 18
        years of age and I agree to having my data used in this study&quot;
      </p>
      <RadioGroup name="agreement" required>
        <Label className="flex flex-row-reverse items-center justify-end gap-4 xl:text-lg">
          <span>
            I am under 18 and/or I do not agree to participate in the study.
          </span>
          <RadioGroupItem className="size-5 shrink-0" value="no" />
        </Label>
        <Label className="flex flex-row-reverse items-center justify-end gap-4 xl:text-lg">
          <span>
            I have read and understood the information above, I am 18 years or
            older, and I agree to participate in this study.
          </span>
          <RadioGroupItem className="size-5 shrink-0" value="yes" />
        </Label>
      </RadioGroup>
      <Submit />
    </Form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" pending={pending} disabled={pending}>
      Submit
    </Button>
  );
}
