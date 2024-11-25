export type QuestionType = "single_choice" | "multiple_choice" | "number_input" | "true_false" | "grid";


export interface Option {
  text: string;
  value: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  correct_answer?: string;
  display_logic?: {
    depends_on: string;
    not_equals: string;
  };
}
export interface GridQuestion extends Question {
    type: "grid";
    rows: string[];
    columns: string[];
  }
  
export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export const surveyData = {
  survey_name: "iTELL Intake Survey",
  sections: [
    {
      id: "technology_access",
      title: "Technology Access and Usage",
      questions: [
        {
          id: "device_primary",
          text: "Which of the following do you use as your primary device for learning?",
          type: "single_choice",
          options: [
            { text: "Your own personal laptop or desktop computer", value: 1 },
            { text: "Shared or borrowed (e.g., household laptop or desktop computer)", value: 7 },
            { text: "Public (e.g., library) laptop or desktop computer", value: 8 },
            { text: "Your own personal tablet", value: 2 },
            { text: "Shared or borrowed (e.g., household) tablet", value: 3 },
            { text: "Your own personal mobile/cellphone", value: 4 },
            { text: "Shared or borrowed mobile/cellphone", value: 9 }
          ]
        },
        {
          id: "device_hours",
          text: "How many hours per day do you use a computer, tablet, or smartphone?",
          type: "single_choice",
          options: [
            { text: "None", value: 1 },
            { text: "1 hour", value: 2 },
            { text: "1 to 2 hours", value: 3 },
            { text: "2 to 3 hours", value: 4 },
            { text: "3 to 5 hours", value: 5 },
            { text: "More than 5 hours per day", value: 6 }
          ]
        },
        {
          id: "tech_access_place",
          text: "Which of the following best describes your internet access situation for class work?",
          type: "single_choice",
          options: [
            { text: "I rely on strong home internet access", value: 1 },
            { text: "I rely on weak or unreliable home internet access", value: 2 },
            { text: "I rely on library, coffee shop, or other free wifi", value: 3 }
          ]
        },
        {
          id: "tech_access",
          text: "ALL THINGS CONSIDERED, do you have concerns about access to the technology (devices OR internet access) that you need to complete your classwork?",
          type: "single_choice",
          options: [
            { text: "I am not concerned about my technology access.", value: 1 },
            { text: "I am mildly concerned about my technology access.", value: 2 },
            { text: "I am moderately concerned about my technology access.", value: 3 },
            { text: "I am very concerned about my technology access.", value: 4 }
          ]
        }
      ]
    },
    {
      id: "digital_text_experience",
      title: "Digital Text Experience",
      questions: [
        {
          id: "device_comfort",
          text: "How would you rate your comfort level in using technology?",
          type: "single_choice",
          options: [
            { text: "Very comfortable", value: 1 },
            { text: "Comfortable", value: 2 },
            { text: "Neutral", value: 3 },
            { text: "Uncomfortable", value: 4 },
            { text: "Very uncomfortable", value: 5 }
          ]
        },
        {
          id: "text_num_per_week",
          text: "How many hours do you spend reading online per week?",
          type: "single_choice",
          options: [
            { text: "None", value: 1 },
            { text: "1-3", value: 2 },
            { text: "4-10", value: 3 },
            { text: "10-20", value: 4 },
            { text: "More than 20", value: 5 }
          ]
        },
        {
          id: "text_satisfaction",
          text: "Overall, how satisfied or dissatisfied are you with the digital texts you have used?",
          type: "single_choice",
          display_logic: {
            depends_on: "text_num_per_week",
            not_equals: "None"
          },
          options: [
            { text: "Extremely satisfied", value: 1 },
            { text: "Somewhat satisfied", value: 2 },
            { text: "Neither satisfied nor dissatisfied", value: 3 },
            { text: "Somewhat dissatisfied", value: 4 },
            { text: "Extremely dissatisfied", value: 5 }
          ]
        }
      ]
    },
    {
      id: "demographics",
      title: "Demographics",
      questions: [
        {
          id: "demo_age",
          text: "How old are you? Please write your age as a number (e.g. 21)",
          type: "number_input"
        },
        {
          id: "demo_gender",
          text: "What gender do you identify as?",
          type: "single_choice",
          options: [
            { text: "Man", value: 1 },
            { text: "Woman", value: 2 },
            { text: "Nonbinary", value: 3 },
            { text: "Other", value: 4 },
            { text: "Prefer not to say", value: 5 }
          ]
        },
        {
          id: "demo_ethnicity",
          text: "How would you describe yourself (check all that apply)",
          type: "multiple_choice",
          options: [
            { text: "American Indian or Alaska Native", value: 1 },
            { text: "Hawaiian or Pacific Islander", value: 8 },
            { text: "Black / African American / African Caribbean", value: 2 },
            { text: "Latino/a/e/x", value: 4 },
            { text: "Middle Eastern", value: 3 },
            { text: "Central Asian", value: 5 },
            { text: "Southeast / East Asian", value: 6 },
            { text: "Maori", value: 7 },
            { text: "White", value: 9 },
            { text: "Prefer not to self-identify", value: 10 }
          ]
        },
        {
          id: "demo_country",
          text: "What is your country of birth?",
          type: "single_choice",
          options: [
            { text: "United States of America", value: 187 }
          ]
        }
      ]
    },
    {
      id: "pretest",
      title: "Pretest Questions",
      questions: [
        {
          id: "Q00",
          text: "Basic research in psychology is conducted primarily to address some practical problem.",
          type: "true_false",
          options: [
            { text: "False", value: 21 },
            { text: "True", value: 22 }
          ],
          correct_answer: "False"
        },
        {
          id: "Q01",
          text: "Psychological disorders and behavioral problems are considered part of the natural world and can be studied scientifically.",
          type: "true_false",
          options: [
            { text: "False", value: 21 },
            { text: "True", value: 22 }
          ],
          correct_answer: "True"
        },
        {
          id: "Q02",
          text: "The purpose of publishing a research article is to conclusively answer questions about the world.",
          type: "true_false",
          options: [
            { text: "False", value: 21 },
            { text: "True", value: 22 }
          ],
          correct_answer: "False"
        }
      ]
    }
  ]
} as const;