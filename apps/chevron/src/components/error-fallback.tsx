import { Card, CardDescription, CardHeader, CardTitle } from "@itell/ui/card";

export const CreateErrorFallback = (
  title = "An error occurred",
  description = "Contact lear.lab.vu@gmail.com if the error persists"
) => {
  return function ErrorFeedback() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    );
  };
};
