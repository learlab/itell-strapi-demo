import { Image } from "@itell/ui/image";
import { Prose } from "@itell/ui/prose";
import htmr from "htmr";

interface Props extends Omit<Prose.Props, "children"> {
  html: string;
  components?: Record<string, any>;
}

export function HtmlRenderer({
  html,
  components = { "i-image": Image },
  ...rest
}: Props) {
  return (
    <Prose {...rest}>
      {htmr(html, {
        transform: components,
      })}
    </Prose>
  );
}
