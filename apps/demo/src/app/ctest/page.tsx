"use client";

import { CTest } from "./c-test";
import { TextTestingComponent } from "./old/text-testing";

// Example data - replace with API response later
const sampleText = `
This is a sample text. More text here for testing.

This is the second paragraph.
`;

export default function CTestPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="text-lg font-medium">old</h2>
      <TextTestingComponent text={sampleText} type="ctest" />
      <h2 className="mt-4 text-lg font-medium">new</h2>
      <CTest
        text={sampleText}
        showLetter={(word) => Math.floor(word.length / 2)}
      />
    </div>
  );
}
