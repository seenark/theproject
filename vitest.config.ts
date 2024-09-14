import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    clearMocks: true,
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@cmd/*": "./src/commands/*",
      "@libs/*": "./src/libs/*",
      "@templates/*": "./src/templates/*",
      "@services/*": "./src/services/*",
      "@prompts/*": "./src/prompts/*",
      "@test/*": "./test/*",
    },
  },
});
