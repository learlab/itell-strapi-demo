export const getScoreMeta = (score: number) => {
  if (score === 0)
    return {
      label: "poor",
      description: "User's answer is considered off-topic by iTELL AI",
    };
  if (score === 1)
    return {
      label: "good",
      description: "User's answer is relevant, but may miss some key points",
    };
  if (score === 2)
    return {
      label: "excellent",
      description: "User's answer captures all the key points",
    };

  return { label: "unknown", description: "unknown" };
};
