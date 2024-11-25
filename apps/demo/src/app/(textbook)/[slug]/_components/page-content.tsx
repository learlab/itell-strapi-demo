import { Elements } from "@itell/constants";

import { TextbookComponents } from "@/components/content-components";
import { HtmlRenderer } from "@/components/html-renderer";

export function PageContent({ html, title }: { html: string; title?: string }) {
  return (
    <HtmlRenderer
      components={TextbookComponents}
      aria-label={title}
      html={html}
      id={Elements.PAGE_CONTENT}
    />
  );
}
