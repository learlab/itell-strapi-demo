import qs from "qs";

const pageSlug = "2-understanding-science";
const base = "https://itell-strapi-um5h.onrender.com";
const filters = qs.stringify({
  filters: {
    Slug: {
      $eq: pageSlug,
    },
  },
});
const fetchPageBySlug = async () => {
  const response = await fetch(`${base}/pages?${filters}`);

  if (response.ok) {
    const data = await response.json();
    const id = data.data[0].id;
    const pageFilter = qs.stringify({
      // fields: ["Title", "Slug"],
      populate: {
        // Content: { fields: ["*"] },
        // Chunk: { fields: ["*"] },
        Volume: true,
      },
    });
    const page = await fetch(`${base}/pages/${id}?${pageFilter})}`);
    const pageData = await page.json();
    console.log(pageData.data.attributes);
  }
};

const volumeFilter = qs.stringify({
  populate: {
    Pages: {
      fields: ["*"],
      populate: {
        Content: true,
        Chapter: {
          fields: ["Title", "Slug"],
        },
        Quiz: {
          populate: {
            Questions: {
              populate: "*",
            },
          },
        },
        // Quiz: {
        //   populate: {
        //     Questions: {
        //       populate: {
        //         Answers: true,
        //       },
        //     },
        //   },
        // },
      },
    },
  },
});

const id = "nhm9t3owr7ze7ij01uduaiop";

const fetchVolume = async () => {
  const url = new URL(`/api/texts/${id}`, base);
  url.search = volumeFilter;
  console.log(volumeFilter);
  const response = await fetch(url);
  if (!response.ok) {
    console.log("error response", await response.json());
    throw new Error("failed to fetch strapi");
  }

  const data = await response.json();

  console.log("volume fields", Object.keys(data.data));
  data.data.Pages.forEach((page, index) => {
    if (index === 0) {
      // console.log("page fields", Object.keys(page));
    }
    if (page.Quiz) {
      // console.log("quiz page", page["Title"]);
      // page.Quiz.Questions.forEach((q) => console.log(q));
    }
  });
};

fetchVolume();
