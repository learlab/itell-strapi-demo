import React, {
  ComponentType,
  HTMLElementType,
  ReactNode,
  SVGElementType,
} from "react";

export type HTMLTags = HTMLElementType;
export type SVGTags = SVGElementType;
type AllTags = HTMLTags | SVGTags;

type HTMLTransform = {
  [tag in AllTags]:
    | AllTags
    | ComponentType<Omit<React.ComponentProps<tag>, "ref">>;
};

type DefaultTransform = {
  _: <Props>(
    element: string | AllTags,
    props?: Props,
    children?: ReactNode
  ) => ReactNode;
};

export type HtmrOptions = {
  transform: Partial<HTMLTransform & DefaultTransform>;
  preserveAttributes: Array<String | RegExp>;
  /** An array of tags in which their children should be set as raw html */
  dangerouslySetChildren: HTMLTags[];
};
