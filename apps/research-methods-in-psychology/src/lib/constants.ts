import type { AnimationProps } from "framer-motion";

export const FOCUS_TIME_SAVE_INTERVAL = 60000;

export const PAGE_SUMMARY_THRESHOLD = 2;

export const SUMMARY_DESCRIPTION_ID = "summary-description";

export const SIDEBAR_STATE_COOKIE = "sidebar:state";
export const DASHBOARD_ROLE_COOKIE = "dashboard:role";
export const PAGE_HEADER_PIN_COOKIE = "page-header:pin";

export const isProduction = process.env.NODE_ENV === "production";
export const ClassRole = {
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const EventType = {
  KEYSTROKE: "keystroke",
  CLICK: "click",
  FOCUS_TIME: "focus-time",
  SCROLL: "scroll",
  CHUNK_REVEAL: "chunk-reveal",
  CHUNK_REVEAL_QUESTION: "post-question-chunk-reveal",
  EXPLAIN: "explain-constructed-response",
  STAIRS: "stairs",
  RANDOM_REREAD: "random_reread",
  SIMPLE: "simple",
  QUIZ: "quiz",
} as const;

export const Condition = {
  SIMPLE: "simple",
  RANDOM_REREAD: "random_reread",
  STAIRS: "stairs",
};
export const Tags = {
  GET_SESSION: "get-session",
  GET_ANSWER_STREAK: "get-answer-streak",
  GET_QUIZ_ATTEMPTS: "get-quiz-attempts",
  COUNT_SUMMARY: "count-summary",
} as const;

export const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;
