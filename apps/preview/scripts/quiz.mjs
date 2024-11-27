import qs from "qs";
const base = "https://itell-strapi-um5h.onrender.com/api/quizzes";

const start = async () => {
  const url = new URL(base);
  url.search = qs.stringify({
    populate: {
      Questions: {
        populate: "*",
      },
    },
  });

  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to fetch quizzes");
    return;
  }
  const { data } = await response.json();

  data.forEach((quiz) => console.log(quiz.Questions));
};

start();
