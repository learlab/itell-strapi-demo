'use client';
import { TextTestingComponent } from './text-testing';

// Example data - replace with API response later 
const sampleText = "This is a sample text. More text here for testing.";

export default function CTestPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <TextTestingComponent text={sampleText} type="ctest" />
    </div>
  );
}