export const isContentWord = (word: string): boolean => {
    const contentWordRegex = /^[a-zA-Z]{4,}$/;
    return contentWordRegex.test(word);
  };
  
  export const splitIntoParagraphs = (text: string): string[] => {
    return text.split(/\n\s*\n/).filter(Boolean);
  };
  
  export const splitFirstSentence = (text: string): { firstSentence: string; rest: string } => {
    const match = text.match(/^[^.!?]+[.!?]\s*/);
    if (!match) return { firstSentence: text, rest: '' };
    
    const firstSentence = match[0];
    const rest = text.slice(firstSentence.length);
    return { firstSentence, rest };
  };