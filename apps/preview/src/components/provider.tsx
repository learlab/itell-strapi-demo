"use client";

import { createContext, useContext, useState } from "react";

type State = {
	value: string;
	setValue: (value: string) => void;
};

export const EditorContext = createContext<State>({} as State);
const initialValue = `
## Markdown text

*Use* the \`print()\` function to output text in **Python**.

| Month    | Savings |
| -------- | ------- |
| January  | $250    |
| February | $80     |
| March    | $420    |


## Math

Inline math: $x^2$

Block math:

$$
a^2 + b^2 = c^2
$$

## Code

Static code block

\`\`\`javascript {2} /bar/#v caption="code caption"
function foo() {
	console.log("Hello World");
}

const bar = "baz";
foo(bar);
\`\`\`

code sandbox

<i-sandbox-js id="1" code="const foo = 'bar';\nconsole.log('hello',\`\${foo}\`);" />



## Callout

<i-callout variant="info" title="Guidance">
Laborum aute veniam ut tempor veniam tempor. Ipsum id eiusmod veniam nulla ipsum incididunt occaecat Lorem commodo minim elit nostrud et. Cupidatat dolore sunt cillum excepteur in excepteur amet.
</i-callout>







## Accordion

<accordion-wrapper value="first">

<accordion-item value='first' title = "First pane">
accordion content 1
</accordion-item>

<accordion-item value='second' title="Second pane">
accordion content 2
</accordion-item>

</accordion-wrapper>

## Image

<i-image
  style="aspect-ratio:678/435;"
  src="https://nbjrajrmujlgxmcvqsge.supabase.co/storage/v1/object/public/strapi/files/1.1.png-e1cb314dd72c8b8360d0cdddc949b81f.png"
  alt="Illustration of a sea of dark and bright dots (bits) with islands in it"
  width="678"
  height="435"
/>


`;
export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
	const [value, setValue] = useState(initialValue);

	return (
		<EditorContext.Provider value={{ value, setValue }}>
			{children}
		</EditorContext.Provider>
	);
};

export const useEditor = () => useContext(EditorContext);
