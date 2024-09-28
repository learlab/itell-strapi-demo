import { NavigationButton } from "@/components/navigation-button";
import { makePageHref } from "@/lib/utils";
import { Elements } from "@itell/constants";

export function SummaryReviseButton({
  pageSlug,
  text,
}: {
  pageSlug: string;
  text: string;
}) {
  const buf = Buffer.from(text);

  return (
    <NavigationButton
      href={`${makePageHref(pageSlug)}#${
        Elements.PAGE_ASSIGNMENTS
      }?summary=${buf.toString("base64")}`}
      size="default"
    >
      Revise this summary
    </NavigationButton>
  );
}
