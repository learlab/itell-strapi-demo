import { getSession } from "@/lib/auth";
import { reportSentry } from "@/lib/utils";
import { createServerActionProcedure } from "zsa";

// procedure for protected actions

export const authedProcedure = createServerActionProcedure()
  .onError((e) => {
    reportSentry("in authed procedure", { error: e });
  })
  .handler(async () => {
    const { user } = await getSession();
    if (!user) {
      throw "action unauthorized";
    }
    return { user };
  })
  .createServerAction();
