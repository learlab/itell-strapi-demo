import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./tests/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
