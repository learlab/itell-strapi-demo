import { getSession } from "@/lib/auth";
import { redirectWithSearchParams } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("auth");
  }

  return <>{children}</>;
}
