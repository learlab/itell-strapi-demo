"use client";

import React, { FormEvent, useRef, useState } from "react";
import { Button } from "@itell/ui/button";
import { Prose } from "@itell/ui/prose";

import { WordItem } from "./word-item";
import type { ShowLetter } from "./word-item";

interface Props {
  paragraphs: string[];
  // number of revealed letters of each word,  0 = cloze test, 2 = c-test
  showLetter?: ShowLetter;
}

// for each word, get the revealed letters and user input letters
type TestResultDataItem = [
  string,
  { placeholder: string[]; answers: string[] },
];

type TestResult = {
  totalWords: number;
  correctWords: number;
  data: Array<TestResultDataItem>;
};

export const CTest = ({ paragraphs, showLetter = 0 }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<TestResult | null>(null);

  if (paragraphs.length < 1) return <p>not enough paragraphs</p>;

  const handleSubmit = (e: FormEvent) => {
    if (!formRef.current) return;
    e.preventDefault();

    const targetWords = Array.from(
      formRef.current.querySelectorAll("fieldset[data-target-word]")
    ) as HTMLFieldSetElement[];

    const testResult: TestResult = {
      totalWords: targetWords.length,
      correctWords: 0,
      data: [],
    };
    targetWords.forEach((field) => {
      const word = field.dataset.targetWord as string;
      const inputs = Array.from(
        field.querySelectorAll("input[type=text]")
      ) as HTMLInputElement[];

      const result = {
        word,
        placeholder: [] as string[],
        answers: [] as string[],
      };
      inputs.forEach((input) => {
        const isTarget = input.dataset.isTarget === "true";
        if (isTarget) {
          result.answers.push(input.value);
        } else {
          result.placeholder.push(input.value);
        }
      });

      testResult.data.push([
        result.word,
        { placeholder: result.placeholder, answers: result.answers },
      ]);

      const joined = result.placeholder.join("") + result.answers.join("");
      if (joined === word) {
        testResult.correctWords++;
      }
    });

    setResult(testResult);
  };

  const handleReset = () => {
    formRef.current?.reset();
  };

  const { firstSentence, rest: firstParagraphRest } = splitFirstSentence(
    paragraphs[0]
  );

  return (
    <div className="space-y-8">
      <form
        className="flex flex-col gap-4 rounded-lg p-6"
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <Prose className="space-y-3">
          {paragraphs.map((paragraph, pIndex) => {
            if (pIndex === 0) {
              return (
                <div key={pIndex}>
                  {firstSentence &&
                    splitWords({ text: paragraph, shouldTarget: false }).map(
                      (wordObj, wIndex) => (
                        <WordItem
                          key={`${pIndex}-${wIndex}`}
                          word={wordObj.text}
                          showLetter={showLetter}
                          isTarget={wordObj.isTarget}
                        />
                      )
                    )}
                  {firstParagraphRest &&
                    splitWords({ text: paragraph, shouldTarget: true }).map(
                      (wordObj, wIndex) => (
                        <WordItem
                          key={`${pIndex}-${wIndex}`}
                          word={wordObj.text}
                          showLetter={showLetter}
                          isTarget={wordObj.isTarget}
                        />
                      )
                    )}
                </div>
              );
            }

            return (
              <div key={pIndex}>
                {splitWords({ text: paragraph, shouldTarget: true }).map(
                  (wordObj, wIndex) => (
                    <WordItem
                      key={`${pIndex}-${wIndex}`}
                      word={wordObj.text}
                      showLetter={showLetter}
                      isTarget={wordObj.isTarget}
                    />
                  )
                )}
              </div>
            );
          })}
        </Prose>
        <div className="flex gap-4">
          <Button type="submit">Score</Button>

          <Button onClick={handleReset} type="button" variant="outline">
            Reset
          </Button>
        </div>
      </form>

      {result ? (
        <pre style={{ fontFamily: "monospace" }}>
          <code>{JSON.stringify(result, null, 2)} </code>
        </pre>
      ) : null}
    </div>
  );
};

const splitWords = ({
  text,
  shouldTarget,
}: {
  text: string;
  shouldTarget: boolean;
}) => {
  const words: { text: string; isTarget: boolean }[] = [];
  let wordCounter = 0;

  const parts = text.split(/(\s+|[.!?,;:])/);

  parts.forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part) || /^[.!?,;:]$/.test(part)) {
      words.push({ text: part, isTarget: false });
      return;
    }
    if (part.trim()) {
      words.push({
        text: part,
        isTarget: shouldTarget && isContentWord(part) && wordCounter % 2 === 1,
      });
      wordCounter++;
    }
  });

  return words;
};

const isContentWord = (word: string): boolean => {
  const contentWordRegex = /^[a-zA-Z]{4,}$/;
  return contentWordRegex.test(word);
};

const splitFirstSentence = (
  text: string
): { firstSentence: string; rest: string } => {
  const match = text.match(/^[^.!?]+[.!?]\s*/);
  if (!match) return { firstSentence: text, rest: "" };

  const firstSentence = match[0];
  const rest = text.slice(firstSentence.length);
  return { firstSentence, rest };
};
