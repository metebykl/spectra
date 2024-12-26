import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/src/**/*.test.ts", "**/test/**.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["**/src/**"],
      exclude: ["**/examples/**"],
    },
  },
});
