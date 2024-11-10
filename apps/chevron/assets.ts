import { readFile, writeFile } from "fs/promises";

const bootstrap = async () => {
  const texts = await Promise.all([
    fetch("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css").then(
      (res) => res.text()
    ),
    readFile("../../packages/driverjs/dist/driver.css"),
  ]);

  await writeFile("public/katex.min.css", texts[0]);
  await writeFile("public/driver.css", texts[1]);
};

bootstrap();
