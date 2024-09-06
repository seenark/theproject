import { Prompt } from "@effect/cli";

export const prompt = Prompt.select({
  message: "select your package manager",
  choices: [
    { title: "npm", value: "npm" as const, description: "use npm as your package manager" },
    { title: "yarn", value: "yarn" as const, description: "use yarn as your package manager" },
    { title: "pnpm", value: "pnpm" as const, description: "use pnpm as your package manager" },
    { title: "bun", value: "bun" as const, description: "use bun as your package manager" },
  ],
});
