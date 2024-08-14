"use client";

import { createContext, useContext, useState } from "react";

type State = {
	value: string;
	setValue: (value: string) => void;
};

export const EditorContext = createContext<State>({} as State);
const initialValue = `
## hello world

<my-image
  style="aspect-ratio:678/435;"
  src="https://nbjrajrmujlgxmcvqsge.supabase.co/storage/v1/object/public/strapi/files/1.1.png-e1cb314dd72c8b8360d0cdddc949b81f.png"
  alt="Illustration of a sea of dark and bright dots (bits) with islands in it"
  width="678"
  height="435"
/>


\`\`\`javascript
function foo() {
	console.log("Hello World");
}

const bar = "baz";
foo(bar);
\`\`\`

<callout-info title="Guidance">
Foo bar.
</callout-info>


<js-sandbox id="1" code="const foo = 'bar';\nconsole.log('hello',\`\${foo}\`);" />

<accordion-wrapper value="first" >

<accordion-item value='first' title = "What makes a successful summary">
A successful summary will

* Be within 50 ~ 200 words long

* Be written in English

* Be on topic

* Not be plagiarized

* Use appropriate language
</accordion-item>

<accordion-item value='second' title="Scoring details">
Your summary will be automatically score based on the following attributes

* content which will include main points, details to support those main points, and general organization of summary

* language which will evaluate the lexical and syntactic structures of your summary.

* paraphrasing which will include appropriate paraphrasing of text and using objective language

* key words which will include the use of important terms and phases from the text

If your summary scores well on these attributes, you can move to the next section. If your summary scores low on these attributes, you will be required to rewrite the summary before you can move to the next section.
</accordion-item>

</accordion-wrapper>

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
