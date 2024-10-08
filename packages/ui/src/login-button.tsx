import { useState } from "react";

import { Button } from "./button.js";
import { Spinner } from "./spinner.js";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  action: () => Promise<any>;
  title: string;
  icon: React.ReactNode;
}

export const CreateLoginButton = ({ action, icon, title, ...rest }: Props) => {
  return function () {
    const [isPending, setIsPending] = useState(false);
    return (
      <Button
        variant="outline"
        onClick={async () => {
          setIsPending(true);
          await action();
          setIsPending(false);
        }}
        disabled={isPending}
        {...rest}
      >
        {isPending ? <Spinner className="mr-2" /> : icon}
        {title}
      </Button>
    );
  };
};
